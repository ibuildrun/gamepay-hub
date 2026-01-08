# Contributing to GamePay Hub

Спасибо за интерес к проекту! Этот документ описывает правила и рекомендации для контрибьюторов.

## 🌿 Git Workflow

### Ветки

- `main` - production-ready код
- `develop` - основная ветка разработки
- `feature/*` - новые функции
- `fix/*` - исправления багов
- `hotfix/*` - срочные исправления для production

### Создание веток

```bash
# Новая функция
git checkout -b feature/steam-topup

# Исправление бага
git checkout -b fix/payment-validation

# Hotfix
git checkout -b hotfix/critical-security-fix
```

## 📝 Conventional Commits

Все коммиты должны следовать формату [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Типы коммитов

| Тип | Описание |
|-----|----------|
| `feat` | Новая функциональность |
| `fix` | Исправление бага |
| `docs` | Изменения в документации |
| `style` | Форматирование кода |
| `refactor` | Рефакторинг без изменения функциональности |
| `test` | Добавление/изменение тестов |
| `chore` | Обновление зависимостей, конфигов |
| `perf` | Улучшение производительности |
| `ci` | Изменения в CI/CD |

### Примеры

```bash
feat(steam): add login validation endpoint
fix(payment): correct USDT calculation rounding
docs(readme): update installation instructions
refactor(api): extract payment service
test(auth): add JWT refresh token tests
chore(deps): update Laravel to 11.2
```

## 🔄 Pull Request Process

1. Создайте ветку от `develop`
2. Внесите изменения
3. Убедитесь, что тесты проходят
4. Создайте Pull Request в `develop`
5. Дождитесь code review
6. После approve — merge

### PR Checklist

- [ ] Код соответствует стилю проекта
- [ ] Добавлены/обновлены тесты
- [ ] Документация обновлена
- [ ] Все CI проверки пройдены
- [ ] PR имеет понятное описание

## 🎨 Code Style

### TypeScript/JavaScript (Frontend)

- ESLint + Prettier
- Используйте TypeScript strict mode
- Именование: camelCase для переменных, PascalCase для компонентов

```typescript
// ✅ Хорошо
const steamLogin = 'user123';
const SteamTopupForm: React.FC = () => { ... };

// ❌ Плохо
const steam_login = 'user123';
const steamTopupForm = () => { ... };
```

### PHP (Backend)

- PSR-12 стандарт
- PHP CS Fixer для форматирования
- Строгая типизация

```php
<?php

declare(strict_types=1);

namespace App\Services;

final class PaymentService
{
    public function __construct(
        private readonly PayPalychClient $client,
    ) {}

    public function createBill(float $amount): BillResponse
    {
        // ...
    }
}
```

## 🧪 Тестирование

### Frontend

```bash
# Unit тесты
npm test

# С покрытием
npm test -- --coverage

# E2E тесты
npm run test:e2e
```

### Backend

```bash
# Все тесты
php artisan test

# С покрытием
php artisan test --coverage

# Конкретный тест
php artisan test --filter=PaymentServiceTest
```

### Требования к покрытию

- Минимум 70% покрытия кода
- Все новые функции должны иметь тесты
- Property-based тесты для критичной логики

## 📁 Структура файлов

### Frontend

```
frontend/
├── app/                 # Next.js App Router
│   ├── (auth)/         # Auth pages group
│   ├── (main)/         # Main pages group
│   └── api/            # API routes
├── components/
│   ├── ui/             # Base UI components
│   └── features/       # Feature components
├── lib/                # Utilities
├── hooks/              # Custom hooks
└── types/              # TypeScript types
```

### Backend

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   ├── Middleware/
│   │   └── Requests/
│   ├── Models/
│   ├── Services/
│   └── Jobs/
├── database/
│   ├── migrations/
│   └── seeders/
└── tests/
```

## 🔒 Security

- Никогда не коммитьте секреты и API ключи
- Используйте `.env` файлы для конфигурации
- Сообщайте о уязвимостях приватно

## 📞 Контакты

- Issues: GitHub Issues
- Discussions: GitHub Discussions
- Email: dev@gamepay.hub
