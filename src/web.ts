import { WebPlugin } from '@capacitor/core';

import type { NobePlugin } from './definitions';

export class NobeWeb extends WebPlugin implements NobePlugin {
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
}
