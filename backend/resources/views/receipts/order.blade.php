<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Чек #{{ $order->id }}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { color: #10b981; margin: 0; }
        .info { margin-bottom: 20px; }
        .info table { width: 100%; }
        .info td { padding: 5px 0; }
        .info .label { color: #666; }
        .total { font-size: 16px; font-weight: bold; margin-top: 20px; }
        .footer { margin-top: 40px; text-align: center; color: #999; font-size: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>GamePay Hub</h1>
        <p>Чек об оплате</p>
    </div>

    <div class="info">
        <table>
            <tr>
                <td class="label">Номер заказа:</td>
                <td>#{{ $order->id }}</td>
            </tr>
            <tr>
                <td class="label">Дата:</td>
                <td>{{ $order->created_at->format('d.m.Y H:i') }}</td>
            </tr>
            <tr>
                <td class="label">Тип услуги:</td>
                <td>
                    @switch($order->type)
                        @case('steam') Пополнение Steam @break
                        @case('telegram_stars') Telegram Stars @break
                        @case('gift_game') Покупка игры @break
                        @case('gift_card') Подарочная карта @break
                        @default {{ $order->type }}
                    @endswitch
                </td>
            </tr>
            <tr>
                <td class="label">Статус:</td>
                <td>Оплачено</td>
            </tr>
            <tr>
                <td class="label">Покупатель:</td>
                <td>{{ $user->name }} ({{ $user->email ?? $user->telegram_username }})</td>
            </tr>
        </table>
    </div>

    <div class="total">
        Итого: {{ number_format($order->amount, 2, ',', ' ') }} {{ $order->currency }}
    </div>

    <div class="footer">
        <p>Спасибо за покупку!</p>
        <p>GamePay Hub - игровые сервисы</p>
    </div>
</body>
</html>
