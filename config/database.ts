export default ({ env }) => {
  const client = env('DATABASE_CLIENT', 'sqlite')

  if (client === 'sqlite') {
    return {
      connection: {
        client: 'sqlite',
        connection: {
          filename: env('DATABASE_FILENAME', '.tmp/data.db'),
        },
        useNullAsDefault: true,
      },
    }
  }

  // Configuration PostgreSQL pour Railway
  const connection = env('DATABASE_URL')
    ? {
        // Railway fournit DATABASE_URL
        connectionString: env('DATABASE_URL'),
        ssl: {
          rejectUnauthorized: env.bool('DATABASE_SSL_SELF', false),
        },
      }
    : {
        // Configuration manuelle
        host: env('DATABASE_HOST', 'localhost'),
        port: env.int('DATABASE_PORT', 5432),
        database: env('DATABASE_NAME', 'strapi'),
        user: env('DATABASE_USERNAME', 'strapi'),
        password: env('DATABASE_PASSWORD', 'strapi'),
        ssl: env.bool('DATABASE_SSL', false) && {
          rejectUnauthorized: env.bool('DATABASE_SSL_SELF', false),
        },
      }

  return {
    connection: {
      client: 'postgres',
      connection,
      debug: false,
    },
  }
}
