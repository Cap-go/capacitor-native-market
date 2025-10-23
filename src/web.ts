import { WebPlugin } from '@capacitor/core';

import type { NativeMarketPlugin } from './definitions';

export class NativeMarketWeb extends WebPlugin implements NativeMarketPlugin {
  openStoreListing(options: { appId: string; country?: string }): Promise<void> {
    throw new Error('Method not implemented.' + options);
  }

  openDevPage(options: { devId: string }): Promise<void> {
    throw new Error('Method not implemented.' + options);
  }

  openCollection(options: { name: string }): Promise<void> {
    throw new Error('Method not implemented.' + options);
  }

  openEditorChoicePage(options: { editorChoice: string }): Promise<void> {
    throw new Error('Method not implemented.' + options);
  }

  search(options: { terms: string }): Promise<void> {
    throw new Error('Method not implemented.' + options);
  }

  async getPluginVersion(): Promise<{ version: string }> {
    return { version: 'web' };
  }
}
