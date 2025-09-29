import type { APIThumbnail, Thumbnail } from './thumbnail';

export interface APISearchResult {
  etag: string;
  id: {
    kind: 'youtube#video';
    videoId: string;
  };
  kind: 'youtube#searchResult';
  snippet: {
    channelId: string;
    channelTitle: string;
    description: string;
    liveBroadcastContent: 'none';
    publishedAt: string;
    publishTime: string;
    thumbnails: {
      default: APIThumbnail;
      high: APIThumbnail;
      medium: APIThumbnail;
    };
    title: string;
  };
}

export class SearchResult {
  channel: {
    id: string;
    title: string;
  };

  id: string;
  thumbnail: Thumbnail;
  title: string;

  url: string;

  constructor(data: APISearchResult) {
    this.id = data.id.videoId;
    this.title = data.snippet.title;
    this.thumbnail = data.snippet.thumbnails.high ?? data.snippet.thumbnails.default;
    this.channel = {
      id: data.snippet.channelId,
      title: data.snippet.channelTitle,
    };
    this.url = `https://youtu.be/${data.id.videoId}`;
  };
}
