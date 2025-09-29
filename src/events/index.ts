import onAutocomplete from '@/events/client/onAutocomplete';
import onCommand from '@/events/client/onCommand';
import onContextMenu from '@/events/client/onContextMenu';
import player from '@/events/client/player';
import ready from '@/events/client/ready';

import type { EventHandler } from '@/core/event';

export default [
  onAutocomplete,
  onCommand,
  onContextMenu,
  player,
  ready,
] as EventHandler[];
