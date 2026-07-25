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
