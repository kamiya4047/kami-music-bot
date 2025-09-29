import type { Awaitable, ClientEvents } from 'discord.js';

import type { KamiClient } from '@/core/client';

export interface EventHandlerOptions<Event extends Events = Events> {
  event: Event;
  on?: (this: KamiClient, ...args: ClientEvents[Event]) => Awaitable<void>;
  once?: (this: KamiClient, ...args: ClientEvents[Event]) => Awaitable<void>;
}

type Events = keyof ClientEvents;

export class EventHandler<Event extends Events = Events> {
  event: Event;
  on?: (this: KamiClient, ...args: ClientEvents[Event]) => Awaitable<void>;
  once?: (this: KamiClient, ...args: ClientEvents[Event]) => Awaitable<void>;
  constructor(options: EventHandlerOptions<Event>) {
    this.event = options.event;
    this.on = options.on;
    this.once = options.once;
  };
}
