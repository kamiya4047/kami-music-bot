import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { cleanupTitle, formatDuration, getMetadata } from '@/utils/resource';

import type { GuildMember } from 'discord.js';
import type { Track } from 'scdl-core';

import type { RubyText } from '@/utils/string';
import type { Video } from '@/api/youtube/video';

import type { KamiClient } from './client';

export enum Platform {
  File = 'file',
  SoundCloud = 'soundcloud',
  YouTube = 'youtube',
}

export interface KamiLyric {
  from: number;
  line: RubyText[];
  to: number;
  translation: string;
}

export interface KamiMetadata {
  album: string;
  arranger: string[];
  artist: string[];
  composer: string[];
  cover: string;
  diskNo: number;
  hasRuby: boolean;
  lyricist: string[];
  lyrics: KamiLyric[];
  script: string;
  source: string;
  tags: string[];
  title: string;
  trackNo: number;
  year: number;
}

export interface KamiMetadataJson {
  $schema: string;
  album: string;
  arranger: string[];
  artist: string[];
  composer: string[];
  cover: string;
  diskNo: number;
  lyricist: string[];
  lyrics: {
    from: number;
    line: string;
    to: number;
    translation: string;
  }[];
  script: string;
  source: string;
  tags: string[];
  title: string;
  trackNo: number;
  year: number;
}

interface KamiResourceOptions {
  id: string;
  length: null | number;
  thumbnail: string;
  title: string;
  type: Platform;
  url: string;
}

export class KamiResource {
  cache: null | string = null;
  id: string;
  length: null | number;
  member?: GuildMember;
  metadata: KamiMetadata | null = null;
  thumbnail: string;
  title: string;
  type: Platform;
  url: string;

  constructor(client: KamiClient, options: KamiResourceOptions) {
    this.type = options.type;
    this.id = options.id;
    this.title = cleanupTitle(options.title);
    this.length = options.length;
    this.url = options.url;
    this.thumbnail = options.thumbnail;

    const cachePath = join(client.cacheFolderPath, 'audio', options.id);

    if (existsSync(cachePath)) {
      this.cache = cachePath;
    }

    this.metadata = getMetadata(options.title);
  }

  static soundcloud(client: KamiClient, track: Track): KamiResource {
    return new KamiResource(client, {
      id: String(track.id),
      length: track.duration,
      thumbnail: track.artwork_url ?? '',
      title: track.title,
      type: Platform.SoundCloud,
      url: track.uri,
    });
  }

  static youtube(client: KamiClient, video: Video): KamiResource {
    return new KamiResource(client, {
      id: video.id,
      length: video.length,
      thumbnail: video.thumbnail.url,
      title: video.title,
      type: Platform.YouTube,
      url: video.shortUrl,
    });
  }

  getLength() {
    if (!this.length) return 'N/A';
    return formatDuration(this.length);
  }

  setCache(cache: string) {
    this.cache = cache;
    return this;
  }

  setMember(member: GuildMember) {
    this.member = member;
    return this;
  }

  toJSON() {
    return {
      id: this.id,
      length: this.length,
      thumbnail: this.thumbnail,
      title: this.title,
      type: this.type,
      url: this.url,
    };
  }

  toString() {
    return `${this.title} (${this.id})`;
  }
}
