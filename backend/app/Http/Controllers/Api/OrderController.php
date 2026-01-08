<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\PayPalychService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class OrderController extends Controller
{
    public function __construct(
        private PayPalychService $payPalych
    ) {}

    public function index(Request $request): JsonResponse
    {
        $orders = $request->user()
            ->orders()
            ->when($request->get('status'), fn($q, $status) => $q->where('status', $status))
            ->when($request->get('type'), fn($q, $type) => $q->where('type', $type))
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json($orders);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $order = $request->user()
            ->orders()
            ->findOrFail($id);

        // Mask sensitive data in metadata
        $metadata = $order->metadata;
        if (isset($metadata['card_code'])) {
            $metadata['card_code'] = $this->maskCode($metadata['card_code']);
        }

        return response()->json([
            'id' => $order->id,
            'type' => $order->type,
            'status' => $order->status,
            'amount' => $order->amount,
            'currency' => $order->currency,
            'metadata' => $metadata,
            'created_at' => $order->created_at,
            'updated_at' => $order->updated_at,
        ]);
    }

    public function pay(Request $request, int $id): JsonResponse
    {
        $order = $request->user()
            ->orders()
            ->where('status', 'pending')
            ->findOrFail($id);

        // If payment URL exists, return it
        if ($order->payment_url) {
            return response()->json([
                'payment_url' => $order->payment_url,
            ]);
        }

        // Create new payment bill
        $billResult = $this->payPalych->createBill([
            'amount' => $order->amount,
            'order_id' => $order->id,
            'description' => $this->getOrderDescription($order),
            'type' => 'normal',
            'shop_id' => config('services.paypalych.shop_id'),
            'success_url' => config('app.frontend_url') . '/payment/success?order=' . $order->id,
            'fail_url' => config('app.frontend_url') . '/payment/fail?order=' . $order->id,
        ]);

        if (!$billResult['success']) {
            return response()->json([
                'error' => 'Ошибка создания платежа',
            ], 500);
        }

        $order->update([
            'payment_id' => $billResult['bill_id'],
            'payment_url' => $billResult['link_page_url'],
        ]);

        return response()->json([
            'payment_url' => $billResult['link_page_url'],
        ]);
    }

    public function receipt(Request $request, int $id)
    {
        $order = $request->user()
            ->orders()
            ->where('status', 'completed')
            ->findOrFail($id);

        $pdf = Pdf::loadView('receipts.order', [
            'order' => $order,
            'user' => $request->user(),
        ]);

        return $pdf->download("receipt-{$order->id}.pdf");
    }

    private function maskCode(string $code): string
    {
        $length = strlen($code);
        if ($length <= 4) {
            return str_repeat('*', $length);
        }
        return substr($code, 0, 2) . str_repeat('*', $length - 4) . substr($code, -2);
    }

    private function getOrderDescription(Order $order): string
    {
        return match($order->type) {
            'steam' => 'Пополнение Steam',
            'telegram_stars' => 'Telegram Stars',
            'gift_game' => 'Покупка игры',
            'gift_card' => 'Подарочная карта',
            default => 'Заказ #' . $order->id,
        };
    }
}
