<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('external_id')->nullable()->comment('GreenGamePay order ID');
            $table->string('payment_id')->nullable()->comment('PayPalych bill ID (TrsId)');
            $table->string('payment_url', 500)->nullable();
            
            $table->string('type', 50);
            $table->string('status', 50)->default('pending');
            $table->string('payment_status', 50)->default('pending');
            
            $table->decimal('amount', 12, 2);
            $table->decimal('amount_paid', 12, 2)->nullable();
            $table->string('currency', 10)->default('RUB');
            
            $table->jsonb('metadata')->default('{}');
            
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            // Indexes
            $table->index('status');
            $table->index('payment_status');
            $table->index('type');
            $table->index('created_at');
            $table->index('external_id');
            $table->index('payment_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
