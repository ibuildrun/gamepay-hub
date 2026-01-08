<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use App\Exceptions\GreenGamePayException;

/**
 * GreenGamePay Service
 * 
 * Integration with GreenGamePay API for Steam top-up, Telegram Stars,
 * Gift Games, and Gift Cards.
 * 
 * @see https://greengamepay.readme.io/reference
 */
final class GreenGamePayService
{
    private string $baseUrl;
    private ?string $apiToken;

    public function __construct()
    {
        $this->baseUrl = config('services.greengamepay.base_url', 'https://api.greengamepay.com');
        $this->apiToken = config('services.greengamepay.api_token');
    }

    // =========================================
    // Steam Methods
    // =========================================

    /**
     * Check Steam login validity
     * 
     * @param string $login Steam login (not nickname)
     * @return array{
     *   valid: bool,
     *   login: string,
     *   country_code: string,
     *   country: string,
     *   avatar?: string,
     *   nickname?: string
     * }
     */
    public function checkSteamLogin(string $login): array
    {
        // If API token is not configured, use demo mode
        if (empty($this->apiToken)) {
            return $this->demoCheckSteamLogin($login);
        }

        $response = $this->client()->post('/steam/check-login', [
            'login' => $login,
        ]);

        if (!$response->successful()) {
            throw new GreenGamePayException(
                'Failed to check Steam login',
                $response->status()
            );
        }

        return $response->json();
    }

    /**
     * Demo mode: Check Steam login (simulated)
     */
    private function demoCheckSteamLogin(string $login): array
    {
        // Simulate API delay
        usleep(300000); // 300ms
        
        // Simple validation - login must be at least 3 characters
        if (strlen($login) < 3) {
            return [
                'valid' => false,
                'error' => 'Логин слишком короткий',
            ];
        }

        // Demo: return random country from supported list
        $countries = $this->getSupportedCountries();
        $codes = array_keys($countries);
        $randomCode = $codes[array_rand($codes)];

        return [
            'valid' => true,
            'login' => $login,
            'country_code' => $randomCode,
            'country' => $countries[$randomCode],
        ];
    }

    /**
     * Calculate Steam top-up price
     * 
     * @param string $login Steam login
     * @param float $amountRub Amount in RUB
     * @return array{
     *   amount_rub: float,
     *   amount_usdt: float,
     *   exchange_rate: float,
     *   commission: float
     * }
     */
    public function calculateSteamPrice(string $login, float $amountRub): array
    {
        // If API token is not configured, use demo mode
        if (empty($this->apiToken)) {
            return $this->demoCalculateSteamPrice($login, $amountRub);
        }

        $response = $this->client()->post('/steam/calculate', [
            'login' => $login,
            'amount' => $amountRub,
        ]);

        if (!$response->successful()) {
            throw new GreenGamePayException(
                'Failed to calculate Steam price',
                $response->status()
            );
        }

        return $response->json();
    }

    /**
     * Demo mode: Calculate Steam price (simulated)
     */
    private function demoCalculateSteamPrice(string $login, float $amountRub): array
    {
        $exchangeRate = 92.5; // Demo rate
        $amountUsdt = $amountRub / $exchangeRate;

        return [
            'success' => true,
            'price' => $amountRub,
            'amount_rub' => $amountRub,
            'amount_usdt' => round($amountUsdt, 2),
            'exchange_rate' => $exchangeRate,
            'commission' => 0,
        ];
    }

    /**
     * Create Steam top-up order
     * 
     * @param string $login Steam login
     * @param float $amountRub Amount in RUB
     * @return array{
     *   order_id: string,
     *   status: string,
     *   payment_address: string,
     *   amount_usdt: float
     * }
     */
    public function createSteamOrder(string $login, float $amountRub): array
    {
        $response = $this->client()->post('/steam/order', [
            'login' => $login,
            'amount' => $amountRub,
        ]);

        if (!$response->successful()) {
            throw new GreenGamePayException(
                'Failed to create Steam order',
                $response->status()
            );
        }

        return $response->json();
    }

    // =========================================
    // Telegram Stars Methods
    // =========================================

    /**
     * Calculate Telegram Stars price
     * 
     * @param int $stars Number of stars
     * @return array{
     *   stars: int,
     *   price_rub: float,
     *   price_usdt: float,
     *   commission: float
     * }
     */
    public function calculateTelegramStars(int $stars): array
    {
        $cacheKey = "telegram_stars_price_{$stars}";

        return Cache::remember($cacheKey, 300, function () use ($stars) {
            $response = $this->client()->post('/telegram/stars/calculate', [
                'stars' => $stars,
            ]);

            if (!$response->successful()) {
                throw new GreenGamePayException(
                    'Failed to calculate Telegram Stars price',
                    $response->status()
                );
            }

            return $response->json();
        });
    }

    /**
     * Create Telegram Stars order
     * 
     * @param string $username Telegram username
     * @param int $stars Number of stars
     * @return array
     */
    public function createTelegramStarsOrder(string $username, int $stars): array
    {
        $response = $this->client()->post('/telegram/stars/order', [
            'username' => $username,
            'stars' => $stars,
        ]);

        if (!$response->successful()) {
            throw new GreenGamePayException(
                'Failed to create Telegram Stars order',
                $response->status()
            );
        }

        return $response->json();
    }

    // =========================================
    // Gift Games Methods
    // =========================================

    /**
     * Search games by name or APP_ID
     * 
     * @param string $query Search query
     * @return array
     */
    public function searchGames(string $query): array
    {
        $response = $this->client()->post('/games/search', [
            'query' => $query,
        ]);

        if (!$response->successful()) {
            throw new GreenGamePayException(
                'Failed to search games',
                $response->status()
            );
        }

        return $response->json();
    }

    /**
     * Get game price by region
     * 
     * @param int $appId Steam APP_ID
     * @param string $region Region code
     * @return array
     */
    public function getGamePrice(int $appId, string $region): array
    {
        $cacheKey = "game_price_{$appId}_{$region}";

        return Cache::remember($cacheKey, 900, function () use ($appId, $region) {
            $response = $this->client()->post('/games/calculate', [
                'app_id' => $appId,
                'region' => $region,
            ]);

            if (!$response->successful()) {
                throw new GreenGamePayException(
                    'Failed to get game price',
                    $response->status()
                );
            }

            return $response->json();
        });
    }

    /**
     * Create gift game order
     * 
     * @param int $appId Steam APP_ID
     * @param string $recipientLogin Recipient's Steam login
     * @param string $region Region code
     * @return array
     */
    public function createGameOrder(int $appId, string $recipientLogin, string $region): array
    {
        $response = $this->client()->post('/games/order', [
            'app_id' => $appId,
            'recipient_login' => $recipientLogin,
            'region' => $region,
        ]);

        if (!$response->successful()) {
            throw new GreenGamePayException(
                'Failed to create game order',
                $response->status()
            );
        }

        return $response->json();
    }

    // =========================================
    // Gift Cards Methods
    // =========================================

    /**
     * Get available gift cards
     * 
     * @return array
     */
    public function getGiftCards(): array
    {
        $cacheKey = 'gift_cards_catalog';

        return Cache::remember($cacheKey, 900, function () {
            $response = $this->client()->get('/giftcards');

            if (!$response->successful()) {
                throw new GreenGamePayException(
                    'Failed to get gift cards',
                    $response->status()
                );
            }

            return $response->json();
        });
    }

    /**
     * Create gift card order
     * 
     * @param string $cardId Gift card ID
     * @return array
     */
    public function createGiftCardOrder(string $cardId): array
    {
        $response = $this->client()->post('/giftcards/order', [
            'card_id' => $cardId,
        ]);

        if (!$response->successful()) {
            throw new GreenGamePayException(
                'Failed to create gift card order',
                $response->status()
            );
        }

        return $response->json();
    }

    // =========================================
    // Order Methods
    // =========================================

    /**
     * Get order status
     * 
     * @param string $orderId
     * @return array
     */
    public function getOrderStatus(string $orderId): array
    {
        $response = $this->client()->get("/orders/{$orderId}");

        if (!$response->successful()) {
            throw new GreenGamePayException(
                'Failed to get order status',
                $response->status()
            );
        }

        return $response->json();
    }

    /**
     * Confirm order payment
     * 
     * @param string $orderId
     * @return array
     */
    public function confirmPayment(string $orderId): array
    {
        $response = $this->client()->post("/orders/{$orderId}/pay");

        if (!$response->successful()) {
            throw new GreenGamePayException(
                'Failed to confirm payment',
                $response->status()
            );
        }

        return $response->json();
    }

    // =========================================
    // Utility Methods
    // =========================================

    /**
     * Get current exchange rate
     * 
     * @return array{
     *   rub_to_usdt: float,
     *   usdt_to_rub: float,
     *   updated_at: string
     * }
     */
    public function getExchangeRate(): array
    {
        $cacheKey = 'exchange_rate';

        return Cache::remember($cacheKey, 300, function () {
            $response = $this->client()->get('/exchange-rate');

            if (!$response->successful()) {
                throw new GreenGamePayException(
                    'Failed to get exchange rate',
                    $response->status()
                );
            }

            return $response->json();
        });
    }

    /**
     * Get supported countries for Steam
     * 
     * @return array
     */
    public function getSupportedCountries(): array
    {
        return [
            'RU' => 'Россия',
            'KZ' => 'Казахстан',
            'BY' => 'Беларусь',
            'UA' => 'Украина',
            'UZ' => 'Узбекистан',
            'KG' => 'Кыргызстан',
            'AZ' => 'Азербайджан',
            'AM' => 'Армения',
            'TJ' => 'Таджикистан',
            'MD' => 'Молдова',
            'TM' => 'Туркменистан',
            'GE' => 'Грузия',
        ];
    }

    /**
     * Get configured HTTP client
     */
    private function client(): PendingRequest
    {
        return Http::baseUrl($this->baseUrl)
            ->withHeaders([
                'Authorization' => "Bearer {$this->apiToken}",
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ])
            ->timeout(30);
    }
}
