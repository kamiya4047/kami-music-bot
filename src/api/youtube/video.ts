import { parse, toSeconds } from 'iso8601-duration';

import type { Duration } from 'iso8601-duration';

import type { APIThumbnail, Thumbnail } from './thumbnail';

export interface APIVideo {
  contentDetails: {
    duration?: string;
  };
  etag: string;
  id: string;
  kind: 'youtube#video';
  snippet: {
    categoryId: string;
    channelId: string;
    channelTitle: string;
    defaultAudioLanguage: string;
    description: string;
    liveBroadcastContent: string;
    localized: {
      description: string;
      title: string;
    };
    publishedAt: string;
    thumbnails: {
      default: APIThumbnail;
      high: APIThumbnail;
      maxres?: APIThumbnail;
      medium: APIThumbnail;
      standard?: APIThumbnail;
    };
    title: string;
  };
}

interface IVideo {
  channel: {
    id: string;
    title: string;
  };
  duration: Duration | null;
  id: string;
  /** Duration in miliseconds */
  length: null | number;
  raw: APIVideo;
  shortUrl: string;
  thumbnail: Thumbnail;
  title: string;
  url: string;
}

export class Video implements IVideo {
  channel: {
    id: string;
    title: string;
  };

  duration: Duration | null;
  id: string;
  length: null | number;
  raw: APIVideo;
  shortUrl: string;
  thumbnail: Thumbnail;
  title: string;

  url: string;

  constructor(data: IVideo) {
    this.id = data.id;
    this.title = data.title;
    this.thumbnail = data.thumbnail;
    this.duration = data.duration;
    this.length = data.length;
    this.url = data.url;
    this.shortUrl = data.shortUrl;
    this.channel = data.channel;
    this.raw = data.raw;
  }

  static fromVideo(data: APIVideo) {
    const id = data.id;
    const title = data.snippet.title;
    const thumbnail = data.snippet.thumbnails.high ?? data.snippet.thumbnails.default;
    const duration = data.contentDetails.duration ? parse(data.contentDetails.duration) : null;
    const length = duration ? toSeconds(duration) * 1000 : null;

    return new Video({
      channel: {
        id: data.snippet.channelId,
        title: data.snippet.channelTitle,
      },
      duration,
      id,
      length,
      raw: data,
      shortUrl: `https://youtu.be/${data.id}`,
      thumbnail,
      title,
      url: `https://youtube.com/watch?v=${data.id}`,
    });
  }
}
