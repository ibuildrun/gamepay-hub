<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\GreenGamePayService;
use App\Services\PayPalychService;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class GiftCardsController extends Controller
{
    public function __construct(
        private GreenGamePayService $greenGamePay,
        private PayPalychService $payPalych
    ) {}

    public function index(Request $request): JsonResponse
    {
        $platform = $request->get('platform');

        $cacheKey = "giftcards_" . ($platform ?? 'all');
        
        $cards = Cache::remember($cacheKey, 300, function () use ($platform) {
            return $this->greenGamePay->getGiftCards($platform);
        });

        if (!$cards['success']) {
            return response()->json([
                'error' => $cards['error'] ?? 'Ошибка загрузки каталога',
            ], 500);
        }

        return response()->json($cards['data']);
    }

    public function show(string $id): JsonResponse
    {
        $cacheKey = "giftcard_{$id}";
        
        $card = Cache::remember($cacheKey, 600, function () use ($id) {
            return $this->greenGamePay->getGiftCardDetails($id);
        });

        if (!$card['success']) {
            return response()->json([
                'error' => $card['error'] ?? 'Карта не найдена',
            ], 404);
        }

        return response()->json($card['data']);
    }

    public function createOrder(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'quantity' => 'nullable|integer|min:1|max:10',
        ]);

        $quantity = $validated['quantity'] ?? 1;

        // Get card details
        $cardResult = $this->greenGamePay->getGiftCardDetails($id);

        if (!$cardResult['success']) {
            return response()->json([
                'error' => 'Карта не найдена',
            ], 404);
        }

        $card = $cardResult['data'];
        $price = ($card['price'] ?? 0) * $quantity;

        if ($price <= 0) {
            return response()->json([
                'error' => 'Цена карты недоступна',
            ], 400);
        }

        // Create order
        $order = Order::create([
            'user_id' => $request->user()->id,
            'type' => 'gift_card',
            'status' => 'pending',
            'amount' => $price,
            'currency' => 'RUB',
            'metadata' => [
                'card_id' => $id,
                'card_name' => $card['name'] ?? 'Unknown',
                'quantity' => $quantity,
                'platform' => $card['platform'] ?? null,
            ],
        ]);

        // Create payment bill
        $billResult = $this->payPalych->createBill([
            'amount' => $price,
            'order_id' => $order->id,
            'description' => "Подарочная карта: " . ($card['name'] ?? $id) . " x{$quantity}",
            'type' => 'normal',
            'shop_id' => config('services.paypalych.shop_id'),
            'success_url' => config('app.frontend_url') . '/payment/success?order=' . $order->id,
            'fail_url' => config('app.frontend_url') . '/payment/fail?order=' . $order->id,
        ]);

        if (!$billResult['success']) {
            $order->update(['status' => 'failed']);
            return response()->json([
                'error' => 'Ошибка создания платежа',
            ], 500);
        }

        $order->update([
            'payment_id' => $billResult['bill_id'],
            'payment_url' => $billResult['link_page_url'],
        ]);

        return response()->json([
            'order_id' => $order->id,
            'payment_url' => $billResult['link_page_url'],
        ]);
    }
}
