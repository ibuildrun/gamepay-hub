# GamePay Hub

Платформа для пополнения Steam кошельков, покупки Telegram Stars, игр в подарок и подарочных карт.

## 🚀 Технологии

- **Frontend:** Next.js 14 (App Router, SSR/SSG)
- **Backend:** Laravel 11 (API, Queues, Sanctum)
- **Database:** PostgreSQL 16
- **Cache:** Redis 7
- **Payments:** PayPalych API
- **Services:** GreenGamePay API
- **Containerization:** Docker + Docker Compose

## 📁 Структура проекта

```
gamepay-hub/
├── frontend/           # Next.js приложение
├── backend/            # Laravel API
├── infrastructure/     # Docker, Nginx конфигурации
│   ├── docker/
│   └── nginx/
├── legacy/             # Оригинальная Vite/React верстка
├── .github/            # GitHub Actions workflows
└── docker-compose.yml
```

## 🛠 Быстрый старт

### Требования

- Docker Desktop 4.0+
- Docker Compose 2.0+
- Git

### Установка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/your-username/gamepay-hub.git
cd gamepay-hub
```

2. Скопируйте файлы окружения:
```bash
cp .env.example .env
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
```

3. Запустите Docker контейнеры:
```bash
docker-compose -f docker-compose.dev.yml up -d
```

4. Выполните миграции:
```bash
docker-compose exec backend php artisan migrate
```

5. Откройте в браузере:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Admin Panel: http://localhost:8000/admin

## 🔧 Разработка

### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

### Backend (Laravel)

```bash
cd backend
composer install
php artisan serve
```

### Docker Development

```bash
# Запуск всех сервисов
docker-compose -f docker-compose.dev.yml up

# Пересборка контейнеров
docker-compose -f docker-compose.dev.yml up --build

# Остановка
docker-compose -f docker-compose.dev.yml down
```

## 🚢 Production

```bash
# Сборка production образов
docker-compose -f docker-compose.prod.yml build

# Запуск
docker-compose -f docker-compose.prod.yml up -d
```

## 📚 API Документация

API документация доступна по адресу `/api/documentation` после запуска backend.

### Основные эндпоинты

| Метод | Путь | Описание |
|-------|------|----------|
| POST | /api/v1/auth/login | Авторизация |
| POST | /api/v1/steam/check-login | Проверка Steam логина |
| POST | /api/v1/steam/order | Создание заказа на пополнение |
| POST | /api/v1/orders/{id}/pay | Инициация оплаты |
| GET | /api/v1/orders | Список заказов пользователя |

## 🔐 Переменные окружения

### Backend (.env)

```env
APP_ENV=local
APP_KEY=
APP_DEBUG=true

DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=gamepay
DB_USERNAME=gamepay
DB_PASSWORD=secret

REDIS_HOST=redis
REDIS_PORT=6379

GREENGAMEPAY_API_URL=https://api.greengamepay.com
GREENGAMEPAY_API_TOKEN=your_token

PAYPALYCH_BASE_URL=https://pal24.pro
PAYPALYCH_API_TOKEN=your_token
PAYPALYCH_SHOP_ID=your_shop_id
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 🧪 Тестирование

```bash
# Frontend тесты
cd frontend && npm test

# Backend тесты
cd backend && php artisan test

# E2E тесты
npm run test:e2e
```

## 📝 Лицензия

MIT License

## 👥 Команда

- [Your Name](https://github.com/your-username)
