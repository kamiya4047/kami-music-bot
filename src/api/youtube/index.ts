import { env } from '@/env';

import { Playlist } from './playlist';
import { SearchResult } from './search';
import { Video } from './video';
import { YouTubeFetchError } from './error';

import type { APIPlaylist, APIPlaylistItem } from './playlist';
import type { APISearchResult } from './search';
import type { APIVideo } from './video';

enum APIListKind {
  Video = 'youtube#videoListResponse',
}

interface APIResponse<T> {
  etag: string;
  items: T[];
  kind: APIListKind;
  nextPageToken: string;
  pageInfo: {
    resultsPerPage: number;
    totalResults: number;
  };
  prevPageToken: string;
}

const get = async <T = object>(endpoint: string, query: Record<string, string>) => {
  const param = new URLSearchParams({
    key: env.YOUTUBE_TOKEN,
    ...query,
  });

  const url = `https://www.googleapis.com/youtube/v3${endpoint}?${param.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new YouTubeFetchError(response);
  }

  return await response.json() as APIResponse<T>;
};

export const fetchVideo = async (id: string) => {
  const query = {
    id,
    part: 'contentDetails,snippet',
  };

  const data = await get<APIVideo>(`/videos`, query);

  return Video.fromVideo(data.items[0]);
};

export const fetchVideos = async (id: string[]) => {
  const query = {
    id: id.join(),
    maxResults: id.length.toString(),
    part: 'contentDetails,snippet',
  };

  const data = await get<APIVideo>(`/videos`, query);

  return data.items.map((v) => Video.fromVideo(v));
};

export const fetchPlaylist = async (listId: string) => {
  const query = {
    id: listId,
    part: 'id,snippet',
  };

  const data = await get<APIPlaylist>(`/playlists`, query);

  const videos = await fetchPlaylistVideo(listId);

  return new Playlist(data.items[0], videos);
};

export const fetchPlaylistVideo = async (listId: string) => {
  const query = {
    maxResults: '50',
    part: 'id,snippet,contentDetails',
    playlistId: listId,
  };

  const data = await get<APIPlaylistItem>(`/playlistItems`, query);

  const items = data.items;
  const groups = [];

  while (items.length) {
    groups.push(items.splice(0, 50));
  }

  const videos = [];

  for (const group of groups) {
    const ids = group.map((v) => v.snippet.resourceId.videoId);
    videos.push(...(await fetchVideos(ids)));
  }

  return videos;
};

export const searchVideo = async (keyword: string) => {
  const query = {
    maxResults: '25',
    part: 'snippet',
    q: keyword,
    type: 'video',
  };

  const data = await get<APISearchResult>('/search', query);

  return data.items.map((v) => new SearchResult(v));
};

export const parseUrl = (url: string) => {
  try {
    if (/^[A-Za-z0-9_-]{7,12}$/.test(url)) {
      return {
        playlist: null,
        video: url,
      };
    }

    const u = new URL(url);

    if (u.hostname.endsWith('youtu.be')) {
      return {
        playlist: u.searchParams.get('list'),
        video: u.pathname.slice(1),
      };
    }

    return {
      playlist: u.searchParams.get('list'),
      video: u.searchParams.get('v'),
    };
  }
  catch (_) {
    return {
      playlist: null,
      video: null,
    };
  }
};
