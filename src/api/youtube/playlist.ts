import type { APIThumbnail, Thumbnail } from './thumbnail';
import type { Video } from './video';

export interface APIPlaylist {
  etag: string;
  id: string;
  kind: 'youtube#playlist';
  snippet: {
    channelId: string;
    channelTitle: string;
    defaultLanguage: string;
    description: string;
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

export interface APIPlaylistItem {
  contentDetails: {
    endAt: string;
    note: string;
    startAt: string;
    videoId: string;
    videoPublishedAt: string;
  };
  etag: string;
  id: string;
  kind: 'youtube#playlistItem';
  snippet: {
    channelId: string;
    channelTitle: string;
    description: string;
    playlistId: string;
    position: number;
    publishedAt: string;
    resourceId: {
      kind: string;
      videoId: string;
    };
    thumbnails: {
      default: APIThumbnail;
      high: APIThumbnail;
      maxres?: APIThumbnail;
      medium: APIThumbnail;
      standard?: APIThumbnail;
    };
    title: string;
    videoOwnerChannelId: string;
    videoOwnerChannelTitle: string;
  };
}

export class Playlist {
  channel: {
    id: string;
    title: string;
  };

  id: string;
  thumbnail: Thumbnail;
  title: string;

  url: string;
  videos: Video[];

  constructor(data: APIPlaylist, videos: Video[]) {
    this.id = data.id;
    this.title = data.snippet.title;
    this.thumbnail = data.snippet.thumbnails.high ?? data.snippet.thumbnails.default;
    this.channel = {
      id: data.snippet.channelId,
      title: data.snippet.channelTitle,
    };
    this.videos = videos;
    this.url = `https://www.youtube.com/playlist?list=${this.id}`;
  }
}
