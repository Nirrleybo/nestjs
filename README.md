<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
npm install
```

## Running the app

```bash
# Spin local DB
# PGAdmin: host.docker.internal
docker-compose up -d

Name: 

# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Debug

[Debug](https://medium.com/javascript-in-plain-english/debugging-nestjs-in-vscode-d474a088c63b)

## Deploy
The app will be depployed to [Heroku](https://dashboard.heroku.com/apps/mynestjs).

### Creating Postgres DB in Heroku
Before we can deploy the app, we need to create a Postgress db in Heroku and to set the db credencials in a config file.
1. [doc](https://devcenter.heroku.com/articles/heroku-postgresql#connecting-in-node-js)
2. App [Postgress dashboard](https://data.heroku.com/datastores/710b611b-3910-4106-91ab-74b388759c46#) and also in [here](https://devcenter.heroku.com/articles/getting-started-with-nodejs#provision-a-database)
3. After creating the db, find the db credencials in the db [dashboard page](https://data.heroku.com/datastores/710b611b-3910-4106-91ab-74b388759c46#administration)
4. To set the environmetn variables, go to the app [dashboard's settings](https://dashboard.heroku.com/apps/mynestjs/settings) page. Scroll down to `Config Vars` and click on `Reveal Config Vars`.
5. Fill in the Postgress, JWT and other vars.

### Usfull deployment comands
```sh
# Do only once
heroku login

# Do only once
heroku git:remote -a mynestjs

# Deploy
git push heroku master

# Watch app logs
heroku logs --tail
```
## Ref
Nestjs [tutorial](https://wanago.io/2020/07/06/api-nestjs-unit-tests/)

## TODO

1. [Done] sign in user after registring
