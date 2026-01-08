# GamePay Hub

[![CI](https://github.com/ibuildrun/gamepay-hub/actions/workflows/ci.yml/badge.svg)](https://github.com/ibuildrun/gamepay-hub/actions/workflows/ci.yml)
[![Deploy](https://github.com/ibuildrun/gamepay-hub/actions/workflows/deploy.yml/badge.svg)](https://github.com/ibuildrun/gamepay-hub/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![Laravel](https://img.shields.io/badge/Laravel-11-red?logo=laravel)](https://laravel.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)](https://www.docker.com/)

Платформа для пополнения Steam кошельков, покупки Telegram Stars, игр в подарок и подарочных карт.

## Возможности

- **Steam пополнение** - 0% комиссия для 12 стран СНГ
- **Telegram Stars** - покупка звёзд с минимальной комиссией 2%
- **Игры в подарок** - отправка любой игры Steam на аккаунт
- **Подарочные карты** - Steam, PlayStation, Xbox, Nintendo, Apple
- **Авторизация** - Email + Telegram OAuth
- **Админ-панель** - управление заказами и пользователями
- **Тёмная тема** - современный gaming дизайн

## Технологии

| Frontend | Backend | Infrastructure |
|----------|---------|----------------|
| Next.js 14 | Laravel 11 | Docker |
| TypeScript | PHP 8.3 | PostgreSQL 16 |
| Tailwind CSS | Sanctum Auth | Redis 7 |
| Lucide Icons | Queue Jobs | Nginx |

## Структура проекта

```
gamepay-hub/
├── frontend/           # Next.js приложение
│   ├── app/            # App Router pages
│   ├── components/     # React компоненты
│   └── lib/            # Утилиты и API
├── backend/            # Laravel API
│   ├── app/            # Controllers, Models, Services
│   ├── routes/         # API routes
│   └── database/       # Migrations
├── infrastructure/     # Docker, Nginx конфигурации
└── .github/            # CI/CD workflows
```

## Быстрый старт

### Требования

- Docker Desktop 4.0+
- Git

### Установка

```bash
# Клонируйте репозиторий
git clone https://github.com/ibuildrun/gamepay-hub.git
cd gamepay-hub

# Скопируйте файлы окружения
cp .env.example .env

# Запустите Docker контейнеры
docker-compose -f docker-compose.dev.yml up -d

# Выполните миграции
docker-compose exec backend php artisan migrate
```

### Доступ

| Сервис | URL | Порт |
|--------|-----|------|
| Frontend | http://localhost:3010 | 3010 |
| Backend API | http://localhost:8010 | 8010 |
| PostgreSQL | localhost | 5433 |
| Redis | localhost | 6380 |

## Разработка

```bash
# Запуск dev окружения
docker-compose -f docker-compose.dev.yml up

# Пересборка контейнеров
docker-compose -f docker-compose.dev.yml up --build

# Логи
docker-compose -f docker-compose.dev.yml logs -f frontend
docker-compose -f docker-compose.dev.yml logs -f backend
```

## Production

```bash
# Сборка production образов
docker-compose -f docker-compose.prod.yml build

# Запуск
docker-compose -f docker-compose.prod.yml up -d
```

## API Endpoints

### Авторизация
| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/api/auth/register` | Регистрация |
| POST | `/api/auth/login` | Вход |
| POST | `/api/auth/logout` | Выход |
| GET | `/api/auth/me` | Текущий пользователь |

### Steam
| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/api/steam/check-login` | Проверка логина |
| POST | `/api/steam/calculate` | Расчёт стоимости |
| POST | `/api/steam/order` | Создание заказа |

### Заказы
| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/orders` | Список заказов |
| GET | `/api/orders/{id}` | Детали заказа |
| POST | `/api/orders/{id}/pay` | Оплата заказа |

## Настройка платежей PayPalych

Для работы платежей через PayPalych (pal24.pro) необходимо:

1. Зарегистрироваться на https://pal24.pro
2. Создать магазин в личном кабинете
3. Получить API Token и Shop ID
4. Настроить Result URL для вебхуков: `https://your-domain.com/api/webhooks/paypalych`
5. Добавить переменные в `.env`:

```env
PAYPALYCH_BASE_URL=https://pal24.pro
PAYPALYCH_API_TOKEN=your_api_token_here
PAYPALYCH_SHOP_ID=your_shop_id_here
```

### Тестирование платежей

В демо-режиме (без API токена) система работает с моковыми данными. Для полного тестирования:

1. Используйте тестовый магазин PayPalych
2. Создайте тестовый заказ через API
3. Проверьте получение вебхука на `/api/webhooks/paypalych`

## Настройка GreenGamePay

Для работы Steam пополнения:

1. Получите API доступ на https://greengamepay.com
2. Добавьте переменные в `.env`:

```env
GREENGAMEPAY_API_URL=https://api.greengamepay.com
GREENGAMEPAY_API_TOKEN=your_api_token_here
```

## Переменные окружения

```env
# Backend
GREENGAMEPAY_API_URL=https://api.greengamepay.com
GREENGAMEPAY_API_TOKEN=your_token
PAYPALYCH_BASE_URL=https://pal24.pro
PAYPALYCH_API_TOKEN=your_token
PAYPALYCH_SHOP_ID=your_shop_id

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8010
```

## Тестирование

```bash
# Frontend тесты
docker-compose exec frontend npm test

# Backend тесты
docker-compose exec backend php artisan test
```

## Changelog

См. [CHANGELOG.md](CHANGELOG.md) для истории изменений.

## Contributing

См. [CONTRIBUTING.md](CONTRIBUTING.md) для руководства по разработке.

## Security

См. [SECURITY.md](SECURITY.md) для политики безопасности.

## Лицензия

[MIT License](LICENSE) - 2026 GamePay Hub
