<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\GreenGamePayService;
use App\Services\PayPalychService;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class GamesController extends Controller
{
    public function __construct(
        private GreenGamePayService $greenGamePay,
        private PayPalychService $payPalych
    ) {}

    public function index(Request $request): JsonResponse
    {
        $page = $request->get('page', 1);
        $perPage = $request->get('per_page', 20);

        $cacheKey = "games_catalog_{$page}_{$perPage}";
        
        $games = Cache::remember($cacheKey, 300, function () use ($page, $perPage) {
            return $this->greenGamePay->getGamesCatalog($page, $perPage);
        });

        if (!$games['success']) {
            return response()->json([
                'error' => $games['error'] ?? 'Ошибка загрузки каталога',
            ], 500);
        }

        return response()->json($games['data']);
    }

    public function search(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'query' => 'required|string|min:2|max:255',
        ]);

        $result = $this->greenGamePay->searchGames($validated['query']);

        if (!$result['success']) {
            return response()->json([
                'error' => $result['error'] ?? 'Ошибка поиска',
            ], 500);
        }

        return response()->json($result['data']);
    }

    public function show(string $appId): JsonResponse
    {
        $cacheKey = "game_{$appId}";
        
        $game = Cache::remember($cacheKey, 600, function () use ($appId) {
            return $this->greenGamePay->getGameDetails($appId);
        });

        if (!$game['success']) {
            return response()->json([
                'error' => $game['error'] ?? 'Игра не найдена',
            ], 404);
        }

        return response()->json($game['data']);
    }

    public function createOrder(Request $request, string $appId): JsonResponse
    {
        $validated = $request->validate([
            'steam_login' => 'required|string|max:255',
            'region' => 'nullable|string|max:10',
        ]);

        // Get game details and price
        $gameResult = $this->greenGamePay->getGameDetails($appId);

        if (!$gameResult['success']) {
            return response()->json([
                'error' => 'Игра не найдена',
            ], 404);
        }

        $game = $gameResult['data'];
        $price = $game['price'] ?? 0;

        if ($price <= 0) {
            return response()->json([
                'error' => 'Цена игры недоступна',
            ], 400);
        }

        // Create order
        $order = Order::create([
            'user_id' => $request->user()->id,
            'type' => 'gift_game',
            'status' => 'pending',
            'amount' => $price,
            'currency' => 'RUB',
            'metadata' => [
                'app_id' => $appId,
                'game_name' => $game['name'] ?? 'Unknown',
                'steam_login' => $validated['steam_login'],
                'region' => $validated['region'] ?? 'RU',
            ],
        ]);

        // Create payment bill
        $billResult = $this->payPalych->createBill([
            'amount' => $price,
            'order_id' => $order->id,
            'description' => "Покупка игры: " . ($game['name'] ?? $appId),
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
