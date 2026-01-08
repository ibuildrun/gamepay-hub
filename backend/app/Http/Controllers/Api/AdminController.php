<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            if (!$request->user()?->isAdmin()) {
                return response()->json(['error' => 'Forbidden'], 403);
            }
            return $next($request);
        });
    }

    public function stats(): JsonResponse
    {
        $totalOrders = Order::count();
        $totalRevenue = Order::where('status', 'completed')->sum('amount');
        $totalUsers = User::count();
        $pendingOrders = Order::where('status', 'pending')->count();
        
        $today = now()->startOfDay();
        $todayOrders = Order::where('created_at', '>=', $today)->count();
        $todayRevenue = Order::where('created_at', '>=', $today)
            ->where('status', 'completed')
            ->sum('amount');

        $yesterday = now()->subDay()->startOfDay();
        $yesterdayRevenue = Order::whereBetween('created_at', [$yesterday, $today])
            ->where('status', 'completed')
            ->sum('amount');
        
        $revenueChange = $yesterdayRevenue > 0 
            ? round((($todayRevenue - $yesterdayRevenue) / $yesterdayRevenue) * 100, 1)
            : 0;

        return response()->json([
            'totalOrders' => $totalOrders,
            'totalRevenue' => $totalRevenue,
            'totalUsers' => $totalUsers,
            'pendingOrders' => $pendingOrders,
            'todayOrders' => $todayOrders,
            'todayRevenue' => $todayRevenue,
            'revenueChange' => $revenueChange,
            'ordersChange' => 0,
        ]);
    }

    public function orders(Request $request): JsonResponse
    {
        $query = Order::with('user:id,name,email')
            ->orderBy('created_at', 'desc');

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->where('email', 'like', "%{$search}%")
                            ->orWhere('name', 'like', "%{$search}%");
                    });
            });
        }

        $orders = $query->paginate($request->get('per_page', 20));

        return response()->json($orders);
    }

    public function orderDetail(int $id): JsonResponse
    {
        $order = Order::with('user')->findOrFail($id);
        return response()->json($order);
    }

    public function updateOrderStatus(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,processing,completed,failed,refunded',
        ]);

        $order = Order::findOrFail($id);
        $order->update(['status' => $validated['status']]);

        return response()->json([
            'message' => 'Статус обновлен',
            'order' => $order,
        ]);
    }

    public function users(Request $request): JsonResponse
    {
        $query = User::withCount('orders')
            ->withSum(['orders as total_spent' => function ($q) {
                $q->where('status', 'completed');
            }], 'amount')
            ->orderBy('created_at', 'desc');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('telegram_username', 'like', "%{$search}%");
            });
        }

        $users = $query->paginate($request->get('per_page', 20));

        return response()->json($users);
    }

    public function userDetail(int $id): JsonResponse
    {
        $user = User::withCount('orders')
            ->withSum(['orders as total_spent' => function ($q) {
                $q->where('status', 'completed');
            }], 'amount')
            ->findOrFail($id);

        $recentOrders = Order::where('user_id', $id)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return response()->json([
            'user' => $user,
            'recent_orders' => $recentOrders,
        ]);
    }

    public function toggleAdmin(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);
        
        // Prevent self-demotion
        if ($user->id === $request->user()->id) {
            return response()->json(['error' => 'Нельзя изменить свой статус'], 400);
        }

        $user->update(['is_admin' => !$user->is_admin]);

        return response()->json([
            'message' => $user->is_admin ? 'Пользователь назначен администратором' : 'Права администратора сняты',
            'user' => $user,
        ]);
    }
}
