<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\GreenGamePayService;
use App\Services\PayPalychService;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TelegramController extends Controller
{
    private const COMMISSION_RATE = 0.02; // 2%

    public function __construct(
        private GreenGamePayService $greenGamePay,
        private PayPalychService $payPalych
    ) {}

    public function validateUsername(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'username' => 'required|string|max:255',
        ]);

        // Basic validation - Telegram usernames are 5-32 chars, alphanumeric + underscore
        $username = ltrim($validated['username'], '@');
        
        if (!preg_match('/^[a-zA-Z][a-zA-Z0-9_]{4,31}$/', $username)) {
            return response()->json([
                'valid' => false,
                'error' => 'Некорректный формат username',
            ], 400);
        }

        return response()->json([
            'valid' => true,
            'username' => $username,
        ]);
    }

    public function calculate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'stars' => 'required|integer|min:50|max:10000',
        ]);

        $result = $this->greenGamePay->calculateTelegramStars($validated['stars']);

        if (!$result['success']) {
            return response()->json([
                'error' => $result['error'] ?? 'Ошибка расчета',
            ], 400);
        }

        $basePrice = $result['price'];
        $commission = round($basePrice * self::COMMISSION_RATE, 2);
        $total = $basePrice + $commission;

        return response()->json([
            'stars' => $validated['stars'],
            'base_price' => $basePrice,
            'commission' => $commission,
            'commission_rate' => self::COMMISSION_RATE * 100 . '%',
            'total' => $total,
        ]);
    }

    public function createOrder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'username' => 'required|string|max:255',
            'stars' => 'required|integer|min:50|max:10000',
        ]);

        $username = ltrim($validated['username'], '@');

        // Calculate price
        $priceResult = $this->greenGamePay->calculateTelegramStars($validated['stars']);

        if (!$priceResult['success']) {
            return response()->json([
                'error' => $priceResult['error'] ?? 'Ошибка расчета цены',
            ], 400);
        }

        $basePrice = $priceResult['price'];
        $commission = round($basePrice * self::COMMISSION_RATE, 2);
        $total = $basePrice + $commission;

        // Create order
        $order = Order::create([
            'user_id' => $request->user()->id,
            'type' => 'telegram_stars',
            'status' => 'pending',
            'amount' => $total,
            'currency' => 'RUB',
            'metadata' => [
                'telegram_username' => $username,
                'stars' => $validated['stars'],
                'base_price' => $basePrice,
                'commission' => $commission,
            ],
        ]);

        // Create payment bill
        $billResult = $this->payPalych->createBill([
            'amount' => $total,
            'order_id' => $order->id,
            'description' => "Telegram Stars: {$validated['stars']} звезд для @{$username}",
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
