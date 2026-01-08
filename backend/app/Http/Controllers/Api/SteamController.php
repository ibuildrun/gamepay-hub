<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\GreenGamePayService;
use App\Services\PayPalychService;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SteamController extends Controller
{
    public function __construct(
        private GreenGamePayService $greenGamePay,
        private PayPalychService $payPalych
    ) {}

    public function checkLogin(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'login' => 'required|string|max:255',
        ]);

        try {
            $result = $this->greenGamePay->checkSteamLogin($validated['login']);

            return response()->json([
                'valid' => $result['valid'] ?? true,
                'country' => $result['country_code'] ?? $result['country'] ?? null,
                'country_name' => $result['country'] ?? $result['country_name'] ?? null,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'valid' => false,
                'error' => 'Аккаунт не найден или недоступен',
            ], 400);
        }
    }

    public function calculate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'login' => 'required|string|max:255',
            'amount' => 'required|numeric|min:10|max:50000',
        ]);

        $result = $this->greenGamePay->calculateSteamPrice(
            $validated['login'],
            $validated['amount']
        );

        if (!$result['success']) {
            return response()->json([
                'error' => $result['error'] ?? 'Ошибка расчета',
            ], 400);
        }

        return response()->json([
            'steam_amount' => $validated['amount'],
            'price_rub' => $result['price'],
            'commission' => 0,
            'total' => $result['price'],
        ]);
    }

    public function createOrder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'login' => 'required|string|max:255',
            'amount' => 'required|numeric|min:10|max:50000',
        ]);

        // Calculate price
        $priceResult = $this->greenGamePay->calculateSteamPrice(
            $validated['login'],
            $validated['amount']
        );

        if (!$priceResult['success']) {
            return response()->json([
                'error' => $priceResult['error'] ?? 'Ошибка расчета цены',
            ], 400);
        }

        // Create order
        $order = Order::create([
            'user_id' => $request->user()->id,
            'type' => 'steam',
            'status' => 'pending',
            'amount' => $priceResult['price'],
            'currency' => 'RUB',
            'metadata' => [
                'steam_login' => $validated['login'],
                'steam_amount' => $validated['amount'],
            ],
        ]);

        // Create payment bill
        $billResult = $this->payPalych->createBill([
            'amount' => $priceResult['price'],
            'order_id' => $order->id,
            'description' => "Пополнение Steam: {$validated['amount']} руб.",
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
