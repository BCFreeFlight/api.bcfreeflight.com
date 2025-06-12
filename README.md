# BC Free Flight API

## TypeScript Migration

This project has been migrated from JavaScript (.mjs) to TypeScript to provide better type safety and interface-based dependency injection.

## Project Structure

- `src/types/interfaces.ts` - Contains all interfaces for dependency injection
- `src/*.ts` - TypeScript source files
- `dist/` - Build output directory

## Building the Project

```bash
# Install dependencies
npm install

# Type checking
npm run type-check

# Build the project
npm run build
```

## Dependency Injection

The project now uses TypeScript interfaces for dependency injection, allowing for better type checking and code organization. The main interfaces are:

- `DeviceRepository` - For device data access
- `WeatherRepository` - For weather data operations

## Development

1. Make changes to TypeScript files in the `src/` directory
2. Run `npm run type-check` to validate types
3. Run `npm run build` to create the bundle
