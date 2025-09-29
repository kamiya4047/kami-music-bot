import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

import type { WriteFileOptions } from 'node:fs';

export const safeWriteFileSync = (path: string, data: NodeJS.ArrayBufferView | string, options?: WriteFileOptions) => {
  if (!existsSync(path)) {
    mkdirSync(dirname(path), { recursive: true });
  }

  writeFileSync(path, data, options);
};
