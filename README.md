# Pong Shippit

Tool for keeping track of table tennis games played at Shippit

## Installation

```bash
$ npm install
```

There are also some additional dependencies:

- `docker` cli
- `heroku` cli (deployment only)

## Running the app

Ensure `docker` is running and set up your environment with:

```bash
$ docker compose up -d
```

You should also apply any pending schema migrations to your database with:

```bash
$ npm run migrate:dev
```

Standard commands for running the app:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

To populate your environment with test data, run:

```bash
$ ./scripts/dummy-data.sh
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

## Deployment

Both the API and database are hosted in a `Heroku App`.

Deploying the API has to be done manually through the app's [dashboard](https://dashboard.heroku.com/apps/pong-shippit).

Migrating the database is done via the `npm run migrate:production` command. You have to be authenticated with the `heroku` cli.

## TODO

- Error handling
- `DTO` validation
- migration script stores to maintain file integrity

## Future ideas

- Implement the notion of a `season` (or tournament?) where players' elos reset after a certain period.
