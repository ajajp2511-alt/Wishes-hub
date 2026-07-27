import { StorageCore } from './storage-core.js';

export class StorageAssembly {
  constructor() {
    this.core = new StorageCore();
  }

  init() {
    console.log('💾 Storage Module Active!');
  }
}

// 🔽 Yeh wrapper function end me add kar dijiye
export function initStorage() {
  const assembly = new StorageAssembly();
  assembly.init();
  return assembly;
}
