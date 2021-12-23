import { registerPlugin } from '@capacitor/core';

import type { NobePlugin } from './definitions';

const Nobe = registerPlugin<NobePlugin>('Nobe', {
  web: () => import('./web').then(m => new m.NobeWeb()),
});

export * from './definitions';
export { Nobe };
