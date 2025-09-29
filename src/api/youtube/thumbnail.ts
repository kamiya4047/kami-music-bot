export interface APIThumbnail {
  height: number;
  url: string;
  width: number;
}

export class Thumbnail implements APIThumbnail {
  height: number;
  url: string;
  width: number;

  constructor(data: APIThumbnail) {
    this.url = data.url;
    this.width = data.width;
    this.height = data.height;
  };
}
