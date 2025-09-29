import 'dotenv/config';

import { type } from 'arktype';

const schema = type({
  BOT_VERSION: 'string',
  CACHE_FOLDER: 'string',
  DATABASE_URL: 'string',
  DEV_GUILD_ID: 'string',
  DEV_TOKEN: 'string',
  GENIUS_SECRET: 'string',
  KAMI_TOKEN: 'string',
  LASTFM_SECRET: 'string',
  LASTFM_TOKEN: 'string',
  NODE_ENV: '"development" | "production"',
  WEBHOOK_URL: 'string',
  YOUTUBE_TOKEN: 'string',
});

const result = schema({
  BOT_VERSION: process.env['BOT_VERSION'],
  CACHE_FOLDER: process.env['CACHE_FOLDER'] ?? '.cache',
  DATABASE_URL: process.env['DATABASE_URL'],
  DEV_GUILD_ID: process.env['DEV_GUILD_ID'],
  DEV_TOKEN: process.env['DEV_TOKEN'],
  GENIUS_SECRET: process.env['GENIUS_SECRET'],
  KAMI_TOKEN: process.env['KAMI_TOKEN'],
  LASTFM_SECRET: process.env['LASTFM_SECRET'],
  LASTFM_TOKEN: process.env['LASTFM_TOKEN'],
  NODE_ENV: process.env['NODE_ENV'] ?? 'development',
  WEBHOOK_URL: process.env['WEBHOOK_URL'],
  YOUTUBE_TOKEN: process.env['YOUTUBE_TOKEN'],
});

if (result instanceof type.errors) {
  throw new Error(result.summary, { cause: result });
}

export const env = result;
