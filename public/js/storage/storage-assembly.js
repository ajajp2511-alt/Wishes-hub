import { StorageCore } from './storage-core.js';

export class StorageAssembly {
  constructor() {
    this.core = new StorageCore();
  }

  init() {
    console.log('💾 Storage Module Active!');
  }
}
