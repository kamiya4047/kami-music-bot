import { KamiSubcommandGroup } from '@/core/command';

import search from './youtube/search';
import url from './youtube/url';

export default new KamiSubcommandGroup({
  description: 'Add videos from YouTube',
  descriptionLocalizations: {
    'ja': 'YouTubeから動画を追加する',
    'zh-TW': '從 YouTube 新增資源',
  },
  name: 'youtube',
  nameLocalizations: {},
  subcommands: [url, search],
});
