/* Action Handlers Core Logic */
import { ActionConfig } from './action-config.js';

export class ActionCore {
    constructor() {
        this.initListeners();
    }

    initListeners() {
        document.addEventListener('click', (e) => {
            const target = e.target.closest(ActionConfig.selectors.triggerClass);
            if (target) {
                this.handleAction(target);
            }
        });
    }

    handleAction(element) {
        const actionType = element.dataset.action;
        if (!actionType) return;

        console.log(`Action triggered: ${actionType}`);
        // Custom action logic yahan add ki ja sakti hai
    }
          }
