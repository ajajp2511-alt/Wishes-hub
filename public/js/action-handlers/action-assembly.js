import { ActionCore } from './action-core.js';

export class ActionAssembly {
  constructor() {
    this.core = null;
  }

  init() {
    this.core = new ActionCore();
  }
}
