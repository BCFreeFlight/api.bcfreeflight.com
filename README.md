# api.bcfreeflight.com

This Node.js package powers the backend API for [bcfreeflight.com](https://bcfreeflight.com), providing data access and services for free flight device and weather data. It is built in TypeScript, using AWS DynamoDB for data storage and offering type definitions, service abstractions, and a clean HTTP layer for seamless integration.

---

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [Helpful Tips](#helpful-tips)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Device and Weather Data APIs** for Free Flight applications
- **DynamoDB integration** for scalable data storage
- **Modular architecture** for easy maintainability
- **Typed interfaces** for reliability and development speed
- **Bundled for serverless deployment**

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.x or higher recommended)
- [npm](https://www.npmjs.com/) package manager

### Installation

---

## Documentation

- Comprehensive auto-generated documentation is available at:  
  [https://bcfreeflight.com/api.bcfreeflight.com/](https://bcfreeflight.com/api.bcfreeflight.com/)

- To generate/update local docs:
  ```bash
  npm run docs
  ```
  Then open `docs/index.html` in your browser.

---

## Helpful Tips

- **TypeScript Best Practices:** All public interfaces are typed. Use the definitions in `src/interfaces` for type-safe integrations.
- **Environment Variables:** When deploying, configure your AWS credentials and DynamoDB resource names as required by your environment.
- **Testing:** Consider writing tests for your services in a `tests/` directory and mocking DynamoDB for local development.
- **Error Handling:** All API responses are wrapped using the HTTP layer in `src/http` for consistent error handling.
- **AWS Lambda:** Use the bundled code from `dist/bundle.js` for lightweight serverless deployment.

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a pull request

---

## License

[MIT](./LICENSE)

---

## Links

- [Project Documentation](https://bcfreeflight.com/api.bcfreeflight.com/)
- [bcfreeflight.com](https://bcfreeflight.com)