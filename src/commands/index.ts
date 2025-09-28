import add from '@/commands/add';
import clear from '@/commands/clear';
import connect from '@/commands/connect';
import current from '@/commands/current';
import jump from '@/commands/jump';
import lock from '@/commands/lock';
import next from '@/commands/next';
import playlist from '@/commands/playlist';
import prev from '@/commands/prev';
import queue from '@/commands/queue';
import remove from '@/commands/remove';
import repeat from '@/commands/repeat';

import type { KamiCommand } from '@/core/command';

export default [
  add,
  clear,
  connect,
  current,
  jump,
  lock,
  next,
  playlist,
  prev,
  queue,
  remove,
  repeat,
] as KamiCommand[];
