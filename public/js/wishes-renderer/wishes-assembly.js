import { WishesCore } from './wishes-core.js';

export class WishesAssembly {
  constructor() {
    this.core = null;
  }

  init() {
    this.core = new WishesCore();
    console.log('✨ Wishes Renderer Module Loaded Successfully!');
  }
}

// 🔽 Yeh wrapper function end me add kar dijiye
export function initWishesRenderer() {
  const assembly = new WishesAssembly();
  assembly.init();
  return assembly;
}
