# Backend Keedu server

The backend server uses the NestJS framework.
This documentation explains how to configure, launch and test backend server.

## Environment requirements

You need to install packages listed.

**Note**: Please use yarn for install packages dependencies. Use `npm i -g yarn` to install yarn if you don't have it.

```
yarn install
```

## Configuring

To configure backend server, you need to:

- set some environment variables
- create/use a PostgreSQL database

### Environment variables

Backend server requires some environment variables to be set for running
correctly.

Please reference the .env.sample file, then create your .env file (if you deploy it in render or cyclic, please set it in envirioment management of this site)

**Note**: Please create your cloudinary account first, it's used to store the file data. And then get your cloud name, key, secret via this URL: https://console.cloudinary.com/pm/c-7b5e49f6884abf1626fa4c250d7ce6/developer-dashboard

- API_PORT: The port on which your API server is running.
- CLOUDINARY_CLOUD_NAME: Your Cloudinary account's cloud name, used for image hosting and manipulation.
- CLOUDINARY_KEY: Your Cloudinary account's API key.
- CLOUDINARY_SECRET: Your Cloudinary account's API secret.
- HASH_SECRET_KEY: The secret key used for hashing in your application.
- JWT_SECRET_KEY: The secret key used for signing and verifying JSON Web Tokens (JWT) in your application.
- POSTGRES_DB_HOST: The host of your PostgreSQL database.
- POSTGRES_DB_NAME: The name of your PostgreSQL database.
- POSTGRES_DB_PORT: The port on which your PostgreSQL database is running.
- POSTGRES_PASS: The password for your PostgreSQL database.
- POSTGRES_SCHEMA: The schema of your PostgreSQL database.
- POSTGRES_SSL: Whether SSL is enabled for your PostgreSQL database.
- POSTGRES_USER: The username for your PostgreSQL database.

### Database installation

```
yarn migration:create
yarn migration:generate
yarn migration:run
yarn migration:seed
```

## Launching backend server

The backend server may be launched after config:

**For develop mode**:

```
yarn dev
```

**For live mode**:

```
yarn build
yarn prod
```

**Note**: Application will start in port = API_PORT

## Configuring AI Services:

You have the ability to modify the name and key of each AI chat bot. However, please **do not alter the key** value as this could lead to errors. After making any changes, **restart the server** to ensure the new settings take effect. There are two methods to make these changes:

1. Modify the seed data file `migrations/seeds/ai-tool.client.seed.ts`. This method is only effective before executing the `yarn migration:seed` command.
2. Directly alter the `ai_tool` table in the database.
