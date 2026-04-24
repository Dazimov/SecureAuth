# SecureAuth

Welcome.

SecureAuth is a robust, TypeScript-based backend API designed to serve as a secure foundation for building user-centric applications. Built around authentication and authorization workflows, this project provides reusable user management, JWT authentication, OAuth2 login support, role-based access control, and Redis-backed rate limiting.

The core strengths of this project lie in its comprehensive user management system, flexible authentication options, and a well-structured codebase with high type coverage. Built on modern technologies like Express, PostgreSQL, Redis, and Drizzle ORM, SecureAuth prioritizes security, scalability, and ease of extension. Whether you're building a small project or laying the groundwork for a larger application, SecureAuth provides essential backend infrastructure to get started quickly and securely.

![SecureAuth](https://github.com/user-attachments/assets/7da7ff38-0406-4a07-b2f0-62671213868a)

## Table of Contents

- [SecureAuth](#secureauth)
  - [Table of Contents](#table-of-contents)
  - [Tech Stack](#tech-stack)
  - [Main goals](#main-goals)
    - [Functional](#functional)
    - [Developer Experience](#developer-experience)
      - [Documentation](#documentation)
      - [Containers](#containers)
      - [Postman](#postman)
      - [Developer Workflow](#developer-workflow)
    - [Robustness](#robustness)
      - [Typing](#typing)
      - [Tests](#tests)
      - [Express Middleware](#express-middleware)
  - [Installation and development](#installation-and-development)
    - [Initialising the Database](#initialising-the-database)
  - [Feature Matrix](#feature-matrix)
  - [Future ideas](#future-ideas)

## Tech Stack

- Server: `Express 5`
- Database: `PostgreSQL`
- Cache / Rate Limiting: `Redis`
- ORM: `Drizzle`
- Authentication: `JSON Web Tokens [JWT]`
- Single/Social Auth: `Passport`
- Email: `Twilio Sendgrid`
- API Documentation: `Swagger`
- Codebase: `TypeScript`
- Tests: `Jest` `Supertest`
- Containers: `Docker`

Database, ORM, cache, and email service should be relatively easy to swap out if preferred.

## Main goals

### Functional

To provide user-centric authentication and authorization features and a super-solid API base as a foundation for future projects. The API should allow for:

- Users to register a new account
- New accounts to be verifiable via email
- Users to be able to log in with username/email and password
- Users to be able to log in with Google, Apple, etc
- Developers to be able to add additional social logins as desired
- Password to be resettable via email
- Magic login via email 🪄
- Users should be able to log out
- Protected routes to be gated by JWT validation
- Role-based access control to restrict sensitive operations
- Request throttling through Redis-backed rate limiting

Users also need to be managed and manageable, so we also need endpoints for:

- Create User: Used for registering accounts.
- Update User: For making changes to existing user data.
- Soft Delete User: Soft delete, adding a deleted_at value to a user account.
- Hard Delete User: For when you really need to GDPR someone.
- Get User(s): Searching, user self-service, and admins seeing all users.

As well as all of the above, you'll usually need a hierarchy of users, things like moderators and admins, as well as normal users and blocked or suspended users. Many apps don't have any interaction between users, but still need to let them register an account so that they can save data specific to themselves, yet their accounts will still need to be managed by somebody too. We have middleware here that can control who can see, update, or delete who, so it's easy to set it up so users can't get other users' data, or so that only someone with an Admin role can perform specific actions on users with a lesser role.

> [!NOTE]
> At the moment the Users also have some "bonus" properties like "Score" and "Referred by", but I want to be careful not to pepper the user model with things they won't need, so I'm probably going to set up a UserMeta table that can be used for whatever additional values might be needed for specific types of apps and keep the core User model as simple as possible.

### Developer Experience

#### Documentation

Swagger spins up alongside the server when you run this, and will provide API documentation for each endpoint. However I haven't got around to actually adding Swagger docs to every endpoint yet because I'm prioritising functionality and tests first. There's no point documenting endpoints that are still in flux. See the feature matrix below for more details.

#### Containers

Docker is included in the repo and it will spin up a container with a Postgres database instance and an instance of the app when you run it. This is a bare-minimum implementation and I need to revisit it, but the Dockerised database is very handy for local development.

#### Postman

There's a Postman collection in the `postman` directory that I've been trying to keep in sync. You can import it into Postman to get set up quickly for playing with the API. Once you register and log in it should save your JWT in the environment and use it for authorising with all of the other endpoints.

<img width="1512" alt="Postman collection screenshot" src="https://github.com/user-attachments/assets/1897bf3f-1d1e-4cd1-94a0-e6078f1c436b">

#### Developer Workflow

This repo uses local linting, tests, and pre-commit hooks to keep changes consistent. The goal is to keep the codebase shippable, strongly typed, and easy to extend as authentication features evolve.

### Robustness

#### Typing

The TypeScript code should be strongly typed, with no use of `any` or `unknown`. I'm using [this type coverage tool](https://github.com/plantain-00/type-coverage) by @plantain-00 to monitor the use of types across the repo. It runs on a pre-commit hook and generates a lil JSON file that gets stored in the `.github` directory. Unfortunately it's picking up Express's req and res objects as untyped at the moment, but I want to get it close to 100% when I can.

#### Tests

Test coverage also needs to be strong so that I have a lot of confidence in the integrity of everything. Currently it has pretty good coverage across the board, mostly unit tests across middleware, controllers, routes, and services. I can expand integration and end-to-end coverage as the API surface stabilises.

#### Express Middleware

There's some commonly used middlewares set up in the Express app, such as Helmet and Redis-backed rate limiting. I'll revisit this again and see what else is worth adding.

## Installation and development

This is a standard Node/Express app, but you're gonna need a PostgreSQL database to connect to, and Redis if you want to use the distributed rate limiter. Start off by installing the node dependencies with:

```
npm install
```

You'll need a `.env` file in the root of your project. There's an example one at `.env.example` that you can copy.

```
cp .env.example .env
```

You'll need to go into that and put in your own bits and pieces, depending on how and where your database and Redis instances are running. You can run PostgreSQL and Redis as their own apps, in Docker, or in the cloud. Once you have that set up and have your connection details, throw them into your `.env` file.

If you want to use email, for sending password reset mails and verification links, you'll need to set up a SendGrid account and verify an email address. If you want to use Google for logging in you'll have to create a Google app and get OAuth credentials.

If you want to use some other social account for logging in you'll have to wait or extend this repo to cover your own needs 🚀

### Initialising the Database

The npm scripts have a few shortcuts for this sort of thing, but they're mostly wrappers around [drizzle-kit](https://orm.drizzle.team/kit-docs/overview), which is a toolkit for the Drizzle ORM we're using. Once you have a database up and running you can run:

```
npm run push
```

Which will set up your database schema in PostgreSQL. Check out the Drizzle documentation for everything related to migrations and all that fun stuff.

Then you can run the usual script to get everything moving:

```
npm run dev
```

There's also a seed script that will fill your database with as many users as you desire, handy for testing or playing with Postman or whatever.

```
npm run seed
```

If you want to run tests, it's `npm run test`. You get the idea. `npm run` by itself will give you a list of all of the available scripts in an npm-managed app.

For production you'd want to do a `build` and then a `start`, but do so at your own risk 🤭

---

## Feature Matrix

| Endpoint                          | Built | Unit Tests | Integration Tests | SwaggerDocs |
|-----------------------------------|-------|------------|-------------------|-------------|
| `POST /auth/login`                | ✅    | ✅         | ⛔️                | ⛔️          |
| `POST /auth/logout`               | ✅    | ✅         | ⛔️                | ⛔️          |
| `POST /auth/magic-login`          | ✅    | ✅         | ⛔️                | ⛔️          |
| `POST /auth/magic-login-token`    | ✅    | ✅         | ⛔️                | ⛔️          |
| `POST /auth/reset-password`       | ✅    | ✅         | ⛔️                | ⛔️          |
| `POST /auth/refresh`              | ✅    | ✅         | ⛔️                | ⛔️          |
| `POST /auth/reset-password-token` | ✅    | ✅         | ⛔️                | ⛔️          |
| `POST /auth/validate-account`     | ✅    | ⚠️         | ⛔️                | ⛔️          |
| `GET /auth/google`                | ✅    | ✅         | ⛔️                | ⛔️          |
| `GET /auth/google/callback`       | ✅    | ✅         | ⛔️                | ⛔️          |
| `GET /users`                      | ✅    | ✅         | ⛔️                | ⛔️          |
| `GET /users/:id`                  | ✅    | ✅         | ⛔️                | ⛔️          |
| `POST /users`                     | ✅    | ✅         | ⛔️                | ⛔️          |
| `PUT /users/:id`                  | ✅    | ✅         | ⛔️                | ⛔️          |
| `DELETE /users/:id`               | ✅    | ✅         | ⛔️                | ⛔️          |
| `GET /users/self`                 | ✅    | ✅         | ⛔️                | ⛔️          |

---

## Future ideas

This is the sort of project that started off as a quick little tool, yet the more I work on it the more ideas I get for it. Here's some stuff that might make an appearance once I've completed the core functionality.

- Redis token blacklist for JWT revocation
- Additional OAuth providers
- Image service for user images or avatars via S3 or similar
- User-to-user messaging or DMs
- Notification service for push or app notifications
- Event tracking, who edited who?
- Webhooks for key events
- GDPR-related data request or data erase flows
- i18n for returned strings

But there is a bunch of core features, fixes, and refactoring I need to hit up first.

If you got this far, drop a star ⭐️

Thanks for looking!
