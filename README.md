# Hackathon Backend

A flawless, production-ready backend API built with Node.js and Express.js, featuring comprehensive security, validation, and best practices.

## 🚀 Features

- **RESTful API**: Clean, well-structured API endpoints
- **Security**: Helmet.js, CORS, rate limiting, input validation
- **Error Handling**: Comprehensive error handling and logging
- **Validation**: Request validation with express-validator
- **Testing**: Complete test suite with Jest and Supertest
- **Documentation**: Detailed API documentation
- **Health Checks**: Health and readiness endpoints
- **Logging**: Request logging with Morgan
- **Environment Configuration**: Environment-based configuration
- **Graceful Shutdown**: Proper server lifecycle management

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/MIHAchoppa/Hackathon-.git
cd Hackathon-
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env` file

## 🏃 Running the Application

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on `http://localhost:3000` (or your configured PORT)

## 🧪 Testing

Run tests with coverage:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## 📚 API Documentation

See [API.md](./API.md) for detailed API documentation.

### Quick Start

**Health Check:**
```bash
curl http://localhost:3000/health
```

**Get All Items:**
```bash
curl http://localhost:3000/api/v1/items
```

**Create an Item:**
```bash
curl -X POST http://localhost:3000/api/v1/items \
  -H "Content-Type: application/json" \
  -d '{"name":"My Item","description":"This is my item description"}'
```

## 🏗️ Project Structure

```
.
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
├── tests/               # Test files
├── .env.example         # Environment variables template
├── jest.config.js       # Jest configuration
├── package.json         # Dependencies and scripts
└── API.md              # API documentation
```

## 🔐 Security Features

- **Helmet.js**: Sets various HTTP headers for security
- **CORS**: Configurable Cross-Origin Resource Sharing
- **Rate Limiting**: Prevents abuse with configurable limits
- **Input Validation**: Validates all incoming requests
- **Error Handling**: Secure error responses without leaking sensitive data

## 🌟 Best Practices

- Clean code architecture
- Separation of concerns
- Error handling and logging
- Input validation
- Security hardening
- Comprehensive testing
- API documentation
- Environment-based configuration
- Graceful shutdown handling

## 🛠️ Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start development server with auto-reload
- `npm test` - Run tests with coverage
- `npm run test:watch` - Run tests in watch mode

## 📝 Environment Variables

See `.env.example` for all available configuration options:

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `API_PREFIX`: API base path (default: /api/v1)
- `RATE_LIMIT_WINDOW_MS`: Rate limit window in milliseconds
- `RATE_LIMIT_MAX_REQUESTS`: Max requests per window
- `CORS_ORIGIN`: Allowed CORS origins

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Development

Built with ❤️ for the Hackathon project.