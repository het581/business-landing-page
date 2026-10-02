# NEXORA security notes

## Included in this static build
- Content Security Policy (meta fallback + deployment header examples)
- `X-Content-Type-Options: nosniff`
- Strict referrer policy
- Permissions policy
- Frame-embedding protection
- Form input length limits and validation
- NUL/control-character stripping
- Honeypot anti-spam field
- Client-side submission cooldown
- URL-encoded `mailto:` construction
- No API keys or credentials in frontend files

## Important limitation
This is a static frontend. Browser-side JavaScript cannot provide authoritative security.

For a production backend, also implement:
- Server-side validation and output encoding
- CSRF protection where cookie-based state is used
- Server-side rate limiting
- Bot protection / abuse monitoring
- Secure authentication and session handling if accounts are added
- HTTPS/HSTS at the deployment layer
- Security logging and alerting
- Dependency and supply-chain review
- Secrets stored only in server-side environment variables
- Email sending through a server/API rather than exposing credentials

## Deployment
Use the supplied `_headers` file on hosts that support it, or configure equivalent HTTP response headers in your CDN/server. `vercel.json` contains an example for Vercel.

Replace `hello@nexora.example` with your real business email before publishing.
