import { WishesCore } from './wishes-core.js';

export class WishesAssembly {
  constructor() {
    this.core = null;
  }

  async init() {
    this.core = new WishesCore();
    await this.core.startApp();
    console.log('✨ Wishes Renderer Module Loaded Successfully!');
  }
}

export function initWishesRenderer() {
  const assembly = new WishesAssembly();
  assembly.init();
  return assembly;
}
