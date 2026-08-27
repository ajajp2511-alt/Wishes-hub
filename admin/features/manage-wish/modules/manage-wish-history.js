/**
 * Manage Wish Feature - Revision History & Undo Engine
 * Path: admin/features/manage-wish/manage-wish-history.js
 */

export class ManageWishHistory {
  constructor() {
    this.historyStack = [];
    this.maxHistorySize = 20; // Maximum undo steps allowed
  }

  /**
   * Log an action to local history stack for instant UNDO
   */
  pushAction(actionType, wishData, previousState) {
    if (this.historyStack.length >= this.maxHistorySize) {
      this.historyStack.shift(); // Remove oldest entry
    }

    this.historyStack.push({
      actionId: `ACT_${Date.now()}`,
      actionType, // e.g., 'STATUS_UPDATE', 'DELETE', 'EDIT'
      wishData,
      previousState,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Rollback / Undo the last performed action
   */
  async undoLastAction() {
    if (this.historyStack.length === 0) {
      return { success: false, message: 'No actions to undo.' };
    }

    const lastAction = this.historyStack.pop();

    try {
      const response = await fetch('/api/sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'rollback_action',
          actionDetails: lastAction
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Rollback failed');

      return {
        success: true,
        restoredAction: lastAction.actionType,
        wishId: lastAction.wishData.Wish_ID
      };
    } catch (error) {
      console.error('[ManageWishHistory] Undo Error:', error);
      // Re-insert action back to stack if network call failed
      this.historyStack.push(lastAction);
      return { success: false, message: error.message };
    }
  }

  /**
   * Fetch complete revision logs for a single Wish from Backend
   */
  async fetchLogsForWish(wishId) {
    try {
      const response = await fetch(`/api/sheets?action=get_logs&wishId=${wishId}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Failed to fetch logs');

      return { success: true, logs: data.logs || [] };
    } catch (error) {
      console.error('[ManageWishHistory] Fetch Logs Error:', error);
      return { success: false, message: error.message };
    }
  }
}

export const manageWishHistoryInstance = new ManageWishHistory();
