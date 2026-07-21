/* Action Handlers Assembly */
import { ActionCore } from './action-core.js';

export function initActionHandlers() {
    const actionModule = new ActionCore();
    console.log('Action Handlers Module Loaded Successfully.');
    return actionModule;
}
