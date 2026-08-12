/**
 * Users & CRM Module - Activity Tracker & Analytics Engine
 * Path: admin/features/users-crm/users-activity.js
 */

export class UsersActivity {
  constructor() {
    this.userActivities = new Map();
    this.savedWishesMap = new Map();
  }

  /**
   * Fetch activity logs and sessions for a specific user
   */
  async fetchUserActivityLogs(userId) {
    try {
      const response = await fetch(`/api/users/activity?userId=${userId}`);
      const result = await response.json();

      if (!response.ok) throw new Error(result.message || 'Failed to fetch user activity');

      this.userActivities.set(userId, result.data || []);
      return { success: true, logs: result.data };
    } catch (error) {
      console.error('[UsersActivity] Fetch Error:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Fetch Saved/Bookmarked Wishes by User
   */
  async fetchSavedWishes(userId) {
    try {
      const response = await fetch(`/api/users/saved-wishes?userId=${userId}`);
      const result = await response.json();

      if (!response.ok) throw new Error(result.message || 'Failed to fetch saved wishes');

      this.savedWishesMap.set(userId, result.data || []);
      return { success: true, wishes: result.data };
    } catch (error) {
      console.error('[UsersActivity] Saved Wishes Error:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Terminate/Kill active user session remotely (Session Killer)
   */
  async killUserSession(userId, sessionId) {
    try {
      const response = await fetch('/api/users/sessions/kill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, sessionId })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to terminate session');

      return { success: true };
    } catch (error) {
      console.error('[UsersActivity] Session Kill Error:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Calculate User LTV Metrics (Engagement & Activity score)
   */
  calculateLTVScore(userData) {
    const wishesCreated = userData.createdWishesCount || 0;
    const daysActive = userData.daysActive || 1;
    const referrals = userData.referralCount || 0;

    const score = (wishesCreated * 10) + (referrals * 25) + (daysActive * 2);
    
    let tier = 'Standard';
    if (score > 500) tier = 'VIP High-Value';
    else if (score > 200) tier = 'Power User';

    return { score, tier };
  }
}

export const usersActivityInstance = new UsersActivity();
