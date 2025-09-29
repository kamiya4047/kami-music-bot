import addToPlaylist from '@/contexts/add_to_playlist';
import addToQueue from '@/contexts/add_to_queue';

import type { KamiContext } from '@/core/context';

const contextMenus: KamiContext[] = [
  addToPlaylist,
  addToQueue,
];

export default contextMenus;
