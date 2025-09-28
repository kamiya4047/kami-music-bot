import { Platform } from '@/core/resource';

import { createTable } from './utils';

export const playlist = createTable('playlist', ({ text, timestamp, varchar }) => ({
  id: varchar('id').unique().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  resources: text('resources').references(() => resource.id).array().notNull(),
  ownerId: varchar('owner_id').notNull(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdateFn(() => new Date(Date.now())),
}));

export const preference = createTable('preference', ({ boolean, real, smallint, text, varchar }) => ({
  userId: varchar('user_id', { length: 20 }).primaryKey().unique(),
  name: text('name'),
  lock: boolean('lock'),
  volume: real('volume'),
  region: varchar('region', { enum: ['brazil', 'hongkong', 'india', 'japan', 'rotterdam', 'singapore', 'southafrica', 'sydney', 'us-central', 'us-east', 'us-south', 'us-west'] }),
  bitrate: smallint('bitrate'),
  nsfw: boolean('nsfw'),
  limit: smallint('limit'),
  repeat: smallint('repeat'),
}));

export const resource = createTable('resource', ({ integer, text }) => ({
  resourceId: text('resource_id').primaryKey().unique(),
  id: text('id').notNull(),
  type: text('platform', { enum: [Platform.SoundCloud, Platform.YouTube, Platform.File] }).notNull(),
  title: text('title').notNull(),
  length: integer('length'),
  url: text('url').notNull(),
  thumbnail: text('thumbnail').notNull(),
}));
