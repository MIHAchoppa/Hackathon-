# Security Policy

## Security Features

This backend implements several security best practices:

### Implemented Security Measures

1. **Helmet.js**: Sets various HTTP security headers
2. **Rate Limiting**: Protects against DDoS and brute force attacks (100 requests per 15 minutes)
3. **Input Validation**: All request data is validated using express-validator
4. **Error Handling**: Secure error responses that don't leak sensitive information in production
5. **Environment Variables**: Configuration through environment variables
6. **CORS Configuration**: Configurable Cross-Origin Resource Sharing

### Known Security Considerations

#### CORS Configuration

The CORS configuration is intentionally flexible to support different deployment scenarios:

- **Development Mode**: The default configuration allows all origins (`*`) for ease of development
- **Production Mode**: You MUST configure specific allowed origins

**Action Required for Production:**
```bash
# Set specific origins in your .env file
CORS_ORIGIN=https://yourdomain.com,https://app.yourdomain.com
```

Never use `CORS_ORIGIN=*` in production as it allows any website to access your API.

### Production Deployment Checklist

Before deploying to production, ensure:

- [ ] Set `NODE_ENV=production`
- [ ] Configure specific CORS origins (not `*`)
- [ ] Use HTTPS (configure at reverse proxy level)
- [ ] Set appropriate rate limits for your use case
- [ ] Keep dependencies updated
- [ ] Use strong authentication (add JWT or similar)
- [ ] Implement proper database security (when adding database)
- [ ] Use secure session management (when adding sessions)
- [ ] Enable logging and monitoring
- [ ] Regular security audits with `npm audit`

### Dependency Vulnerabilities

Current known vulnerabilities:
- `validator` package has a moderate severity URL validation bypass vulnerability (GHSA-9965-vmph-33xx)
  - Impact: Limited - only affects URL validation in express-validator
  - Mitigation: Avoid using URL validation or update to a fixed version when available

### Reporting a Vulnerability

If you discover a security vulnerability, please email the repository maintainer directly instead of opening a public issue.

### Security Updates

- Regularly run `npm audit` to check for vulnerabilities
- Keep all dependencies up to date
- Monitor security advisories for Node.js and Express.js

## Best Practices for Extension

When extending this backend:

1. **Authentication**: Implement JWT or OAuth 2.0 for user authentication
2. **Authorization**: Add role-based access control (RBAC)
3. **Database**: Use parameterized queries to prevent SQL injection
4. **File Uploads**: Validate file types and sizes, scan for malware
5. **Logging**: Log security events but never log sensitive data
6. **API Keys**: Store securely and rotate regularly
7. **Data Validation**: Always validate and sanitize user input
8. **Error Messages**: Don't expose system details in error messages

## Security Headers

The following security headers are set by Helmet.js:

- Content-Security-Policy
- X-DNS-Prefetch-Control
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security
- X-Download-Options
- X-Permitted-Cross-Domain-Policies
- Referrer-Policy
- Cross-Origin-Embedder-Policy
- Cross-Origin-Opener-Policy
- Cross-Origin-Resource-Policy
- Origin-Agent-Cluster
