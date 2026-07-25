import { AdsCore } from './ads-core.js';

export class AdsAssembly {
  constructor() {
    this.core = new AdsCore();
  }

  init() {
    console.log('📢 Ads Manager Module Loaded Successfully!');
  }
}
