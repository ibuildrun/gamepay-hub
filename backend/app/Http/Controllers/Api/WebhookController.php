<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\PayPalychService;
use App\Services\GreenGamePayService;
use App\Jobs\ProcessOrderFulfillment;
use App\Jobs\SendOrderNotification;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

/**
 * Webhook Controller
 * 
 * Handles incoming webhooks from PayPalych and GreenGamePay.
 */
class WebhookController extends Controller
{
    public function __construct(
        private readonly PayPalychService $paypalych,
        private readonly GreenGamePayService $greenGamePay,
    ) {}

    /**
     * Handle PayPalych payment postback
     * 
     * POST /api/v1/webhooks/paypalych
     * 
     * Postback parameters:
     * - InvId: order_id passed when creating bill
     * - OutSum: payment amount
     * - Commission: commission amount
     * - TrsId: unique bill ID
     * - Status: SUCCESS | UNDERPAID | OVERPAID | FAIL
     * - CurrencyIn: USD | RUB | EUR
     * - custom: custom field from bill creation
     */
    public function handlePayPalychPostback(Request $request): Response
    {
        Log::info('PayPalych postback received', $request->all());

        // Validate postback
        if (!$this->paypalych->verifyPostback($request->all())) {
            Log::warning('Invalid PayPalych postback', $request->all());
            return response('Invalid postback', 400);
        }

        $orderId = $request->input('InvId');
        $amount = (float) $request->input('OutSum');
        $commission = (float) $request->input('Commission');
        $trsId = $request->input('TrsId');
        $status = $request->input('Status');

        // Find order
        $order = Order::where('id', $orderId)
            ->orWhere('external_payment_id', $trsId)
            ->first();

        if (!$order) {
            Log::error('Order not found for PayPalych postback', [
                'order_id' => $orderId,
                'trs_id' => $trsId,
            ]);
            return response('Order not found', 404);
        }

        // Check for duplicate postback (idempotency)
        if ($order->payment_status !== 'pending') {
            Log::info('Duplicate PayPalych postback ignored', [
                'order_id' => $order->id,
                'current_status' => $order->payment_status,
            ]);
            return response('OK', 200);
        }

        // Update order based on status
        match ($status) {
            'SUCCESS' => $this->handlePaymentSuccess($order, $amount, $commission, $trsId),
            'UNDERPAID' => $this->handlePaymentUnderpaid($order, $amount, $trsId),
            'OVERPAID' => $this->handlePaymentOverpaid($order, $amount, $commission, $trsId),
            'FAIL' => $this->handlePaymentFail($order, $trsId),
            default => Log::warning('Unknown PayPalych status', ['status' => $status]),
        };

        return response('OK', 200);
    }

    /**
     * Handle GreenGamePay status webhook
     * 
     * POST /api/v1/webhooks/greengamepay
     */
    public function handleGreenGamePayWebhook(Request $request): Response
    {
        Log::info('GreenGamePay webhook received', $request->all());

        $externalId = $request->input('order_id');
        $status = $request->input('status');

        $order = Order::where('external_id', $externalId)->first();

        if (!$order) {
            Log::error('Order not found for GreenGamePay webhook', [
                'external_id' => $externalId,
            ]);
            return response('Order not found', 404);
        }

        match ($status) {
            'completed' => $this->handleFulfillmentCompleted($order),
            'failed' => $this->handleFulfillmentFailed($order, $request->input('error')),
            default => Log::info('GreenGamePay status update', [
                'order_id' => $order->id,
                'status' => $status,
            ]),
        };

        return response('OK', 200);
    }

    // =========================================
    // Payment Status Handlers
    // =========================================

    private function handlePaymentSuccess(Order $order, float $amount, float $commission, string $trsId): void
    {
        Log::info('Payment successful', [
            'order_id' => $order->id,
            'amount' => $amount,
        ]);

        // Update order
        $order->update([
            'external_payment_id' => $trsId,
        ]);
        $order->markAsPaid($amount, $commission);
        $order->markAsProcessing();

        // Dispatch fulfillment job
        ProcessOrderFulfillment::dispatch($order);

        // Send notification
        SendOrderNotification::dispatch($order, 'payment_received');
    }

    private function handlePaymentUnderpaid(Order $order, float $amount, string $trsId): void
    {
        Log::warning('Payment underpaid', [
            'order_id' => $order->id,
            'expected' => $order->amount_rub,
            'received' => $amount,
        ]);

        $order->update([
            'external_payment_id' => $trsId,
        ]);
        $order->markAsUnderpaid($amount);

        // Send notification about underpayment
        SendOrderNotification::dispatch($order, 'payment_underpaid');
    }

    private function handlePaymentOverpaid(Order $order, float $amount, float $commission, string $trsId): void
    {
        Log::info('Payment overpaid', [
            'order_id' => $order->id,
            'expected' => $order->amount_rub,
            'received' => $amount,
        ]);

        $order->update([
            'external_payment_id' => $trsId,
        ]);
        $order->markAsOverpaid($amount);
        $order->markAsPaid($amount, $commission);
        $order->markAsProcessing();

        // Credit excess to user balance
        $excess = $amount - $order->amount_rub;
        if ($order->user && $excess > 0) {
            $order->user->increment('balance', $excess);
            Log::info('Excess credited to user balance', [
                'user_id' => $order->user_id,
                'amount' => $excess,
            ]);
        }

        // Dispatch fulfillment job
        ProcessOrderFulfillment::dispatch($order);

        // Send notification
        SendOrderNotification::dispatch($order, 'payment_overpaid');
    }

    private function handlePaymentFail(Order $order, string $trsId): void
    {
        Log::warning('Payment failed', [
            'order_id' => $order->id,
        ]);

        $order->update([
            'external_payment_id' => $trsId,
            'payment_status' => 'fail',
        ]);
        $order->markAsFailed('Payment failed');

        // Send notification
        SendOrderNotification::dispatch($order, 'payment_failed');
    }

    // =========================================
    // Fulfillment Status Handlers
    // =========================================

    private function handleFulfillmentCompleted(Order $order): void
    {
        Log::info('Fulfillment completed', ['order_id' => $order->id]);

        $order->markAsCompleted();

        // Send notification
        SendOrderNotification::dispatch($order, 'order_completed');
    }

    private function handleFulfillmentFailed(Order $order, ?string $error): void
    {
        Log::error('Fulfillment failed', [
            'order_id' => $order->id,
            'error' => $error,
        ]);

        $order->markAsFailed($error ?? 'Fulfillment failed');

        // Send notification
        SendOrderNotification::dispatch($order, 'order_failed');
    }
}
