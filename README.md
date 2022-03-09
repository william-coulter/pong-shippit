# Pong Shippit

Tool for keeping track of table tennis games played at Shippit

## Installation

```bash
$ npm install
```

There are also some additional dependencies:

- `docker` cli

## Running the app

Ensure `docker` is running and set up your environment with:

```bash
$ npm run start-dev-environment
```

This starts the database and ensures that the `prisma` client is up-to-date.

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## TODO

- environment config
- services in their own module
- API authentication
- Error handling
- `DTO` validation
