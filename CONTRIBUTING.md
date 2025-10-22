# Contributing to Hackathon Backend

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/Hackathon-.git`
3. Install dependencies: `npm install`
4. Copy `.env.example` to `.env` and configure
5. Run tests: `npm test`
6. Start development server: `npm run dev`

## Development Workflow

1. Create a new branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Write/update tests for your changes
4. Run tests: `npm test`
5. Run the server locally: `npm run dev`
6. Test your changes manually
7. Commit your changes with clear commit messages
8. Push to your fork
9. Create a Pull Request

## Code Style

- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Use arrow functions where appropriate
- Follow existing code patterns
- Add comments for complex logic

## Testing

- Write tests for all new features
- Ensure all tests pass before submitting PR
- Maintain or improve code coverage
- Test edge cases and error conditions

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Commit Messages

Follow conventional commit format:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Example:
```
feat: add user authentication endpoint
fix: resolve rate limiting issue
docs: update API documentation
```

## Pull Request Guidelines

- Provide a clear description of the changes
- Link related issues
- Include screenshots for UI changes (if applicable)
- Ensure CI/CD checks pass
- Request review from maintainers
- Keep PRs focused and small when possible

## Code Review Process

- All PRs require at least one approval
- Address review comments promptly
- Be respectful and constructive
- Learn from feedback

## Adding New Features

When adding new features:

1. **Controllers**: Add business logic in `src/controllers/`
2. **Routes**: Define endpoints in `src/routes/`
3. **Middleware**: Add reusable middleware in `src/middleware/`
4. **Validation**: Add validators in `src/middleware/validators.js`
5. **Tests**: Add tests in `tests/`
6. **Documentation**: Update `API.md` with new endpoints

## Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Route controllers (business logic)
├── middleware/      # Custom middleware
├── routes/          # API routes
├── utils/           # Utility functions
├── app.js           # Express app setup
└── server.js        # Server entry point
```

## Security

- Never commit sensitive data (API keys, passwords, etc.)
- Run `npm audit` before submitting PR
- Follow security best practices
- Report security vulnerabilities privately

## Documentation

- Update README.md if you change functionality
- Update API.md for API changes
- Add JSDoc comments for complex functions
- Keep documentation up to date

## Questions?

If you have questions:
- Check existing issues
- Open a new issue with the "question" label
- Reach out to maintainers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉
