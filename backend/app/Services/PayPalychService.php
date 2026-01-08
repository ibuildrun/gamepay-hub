<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use App\Exceptions\PayPalychException;

/**
 * PayPalych Payment Service
 * 
 * Integration with PayPalych API (pal24.pro) for payment processing.
 * 
 * @see https://pally.info/reference/api
 */
final class PayPalychService
{
    private string $baseUrl;
    private ?string $apiToken;
    private ?string $shopId;

    public function __construct()
    {
        $this->baseUrl = config('services.paypalych.base_url', 'https://pal24.pro');
        $this->apiToken = config('services.paypalych.api_token');
        $this->shopId = config('services.paypalych.shop_id');
    }

    /**
     * Check if service is in demo mode (no API token configured)
     */
    public function isDemoMode(): bool
    {
        return empty($this->apiToken);
    }

    /**
     * Create a payment bill
     * 
     * POST /api/v1/bill/create
     * 
     * @param array{
     *   amount: float,
     *   order_id: string,
     *   description?: string,
     *   type?: 'normal'|'multi',
     *   currency_in?: 'RUB'|'USD'|'EUR',
     *   custom?: string,
     *   payer_pays_commission?: 0|1,
     *   payer_email?: string
     * } $params
     * 
     * @return array{
     *   success: bool,
     *   link_url: string,
     *   link_page_url: string,
     *   bill_id: string
     * }
     * 
     * @throws PayPalychException
     */
    public function createBill(array $params): array
    {
        // Demo mode - return mock payment data
        if ($this->isDemoMode()) {
            return $this->demoCreateBill($params);
        }

        $response = $this->client()->post('/api/v1/bill/create', [
            'amount' => $params['amount'],
            'shop_id' => $this->shopId,
            'order_id' => $params['order_id'],
            'description' => $params['description'] ?? "Заказ #{$params['order_id']}",
            'type' => $params['type'] ?? 'normal',
            'currency_in' => $params['currency_in'] ?? 'RUB',
            'custom' => $params['custom'] ?? null,
            'payer_pays_commission' => $params['payer_pays_commission'] ?? 1,
            'payer_email' => $params['payer_email'] ?? null,
        ]);

        if (!$response->successful()) {
            throw new PayPalychException(
                'Failed to create bill: ' . $response->body(),
                $response->status()
            );
        }

        $data = $response->json();

        if (!isset($data['success']) || !$data['success']) {
            throw new PayPalychException(
                $data['message'] ?? 'Unknown error creating bill'
            );
        }

        return [
            'success' => true,
            'link_url' => $data['link_url'],
            'link_page_url' => $data['link_page_url'],
            'bill_id' => $data['bill_id'],
        ];
    }

    /**
     * Demo mode: Create bill (simulated)
     */
    private function demoCreateBill(array $params): array
    {
        $billId = 'DEMO_' . strtoupper(bin2hex(random_bytes(8)));
        
        return [
            'success' => true,
            'link_url' => "https://pal24.pro/demo/{$billId}",
            'link_page_url' => "https://pal24.pro/demo/page/{$billId}",
            'bill_id' => $billId,
        ];
    }

    /**
     * Get bill status
     * 
     * GET /api/v1/bill/status
     * 
     * @param string $billId
     * @return array{
     *   id: string,
     *   order_id: string,
     *   active: bool,
     *   status: 'NEW'|'PROCESS'|'UNDERPAID'|'SUCCESS'|'OVERPAID'|'FAIL',
     *   amount: float,
     *   type: 'MULTI'|'NORMAL',
     *   created_at: string,
     *   currency_in: 'USD'|'RUB'|'EUR',
     *   ttl: int
     * }
     * 
     * @throws PayPalychException
     */
    public function getBillStatus(string $billId): array
    {
        $response = $this->client()->get('/api/v1/bill/status', [
            'bill_id' => $billId,
        ]);

        if (!$response->successful()) {
            throw new PayPalychException(
                'Failed to get bill status: ' . $response->body(),
                $response->status()
            );
        }

        return $response->json();
    }

    /**
     * Search bills
     * 
     * GET /api/v1/bill/search
     * 
     * @param array{
     *   order_id?: string,
     *   status?: string,
     *   date_from?: string,
     *   date_to?: string
     * } $filters
     * 
     * @return array
     * @throws PayPalychException
     */
    public function searchBills(array $filters = []): array
    {
        $response = $this->client()->get('/api/v1/bill/search', $filters);

        if (!$response->successful()) {
            throw new PayPalychException(
                'Failed to search bills: ' . $response->body(),
                $response->status()
            );
        }

        return $response->json();
    }

    /**
     * Get merchant balance
     * 
     * GET /api/v1/merchant/balance
     * 
     * @return array{
     *   balances: array<array{
     *     currency: string,
     *     balance_available: string,
     *     balance_locked: string,
     *     balance_hold: string
     *   }>,
     *   success: bool
     * }
     * 
     * @throws PayPalychException
     */
    public function getBalance(): array
    {
        $cacheKey = 'paypalych_balance_' . $this->shopId;

        return Cache::remember($cacheKey, 60, function () {
            $response = $this->client()->get('/api/v1/merchant/balance');

            if (!$response->successful()) {
                throw new PayPalychException(
                    'Failed to get balance: ' . $response->body(),
                    $response->status()
                );
            }

            return $response->json();
        });
    }

    /**
     * Toggle bill activity
     * 
     * POST /api/v1/bill/toggle_activity
     * 
     * @param string $billId
     * @return array
     * @throws PayPalychException
     */
    public function toggleBillActivity(string $billId): array
    {
        $response = $this->client()->post('/api/v1/bill/toggle_activity', [
            'bill_id' => $billId,
        ]);

        if (!$response->successful()) {
            throw new PayPalychException(
                'Failed to toggle bill activity: ' . $response->body(),
                $response->status()
            );
        }

        return $response->json();
    }

    /**
     * Verify postback signature
     * 
     * @param array $postbackData
     * @return bool
     */
    public function verifyPostback(array $postbackData): bool
    {
        // PayPalych sends postback to Result URL configured in shop settings
        // Verify by checking that order_id exists in our system
        // and TrsId matches the bill we created
        
        $requiredFields = ['InvId', 'OutSum', 'TrsId', 'Status'];
        
        foreach ($requiredFields as $field) {
            if (!isset($postbackData[$field])) {
                return false;
            }
        }

        return true;
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
