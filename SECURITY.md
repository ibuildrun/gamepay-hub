# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability within GamePay Hub, please send an email to security@gamepay-hub.com. All security vulnerabilities will be promptly addressed.

Please include the following information:
- Type of vulnerability
- Full paths of source file(s) related to the vulnerability
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue

## Security Measures

### Authentication
- Laravel Sanctum for API token authentication
- Secure password hashing with bcrypt
- Rate limiting on authentication endpoints

### Data Protection
- All sensitive data encrypted at rest
- HTTPS enforced in production
- CORS properly configured

### Payment Security
- Webhook signature verification
- No sensitive payment data stored locally
- All transactions processed through secure payment providers

## Responsible Disclosure

We kindly ask you to:
- Give us reasonable time to fix the issue before public disclosure
- Make a good faith effort to avoid privacy violations
- Not access or modify data that does not belong to you
