import { Platform } from '@/core/resource';

import { createTable } from './utils';

export const playlist = createTable('playlist', ({ text, timestamp, varchar }) => ({
  id: varchar('id').unique().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  ownerId: varchar('owner_id').notNull(),
  resources: text('resources').references(() => resource.id).array().notNull(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdateFn(() => new Date(Date.now())),
}));

export const preference = createTable('preference', ({ boolean, real, smallint, text, varchar }) => ({
  bitrate: smallint('bitrate'),
  limit: smallint('limit'),
  lock: boolean('lock'),
  name: text('name'),
  nsfw: boolean('nsfw'),
  region: varchar('region', { enum: ['brazil', 'hongkong', 'india', 'japan', 'rotterdam', 'singapore', 'southafrica', 'sydney', 'us-central', 'us-east', 'us-south', 'us-west'] }),
  repeat: smallint('repeat'),
  userId: varchar('user_id', { length: 20 }).primaryKey().unique(),
  volume: real('volume'),
}));

export const resource = createTable('resource', ({ integer, text }) => ({
  id: text('id').notNull(),
  length: integer('length'),
  resourceId: text('resource_id').primaryKey().unique(),
  thumbnail: text('thumbnail').notNull(),
  title: text('title').notNull(),
  type: text('platform', { enum: [Platform.SoundCloud, Platform.YouTube, Platform.File] }).notNull(),
  url: text('url').notNull(),
}));
