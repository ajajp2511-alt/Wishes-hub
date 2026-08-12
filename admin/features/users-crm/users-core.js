/**
 * Users & CRM Module - Core State Manager & Search Engine
 * Path: admin/features/users-crm/users-core.js
 */

import { USER_STATUSES, CRM_SEGMENTS, USERS_CONFIG } from './users-config.js';

export class UsersCore {
  constructor() {
    this.usersList = [];
    this.filteredUsers = [];
    this.selectedSegment = CRM_SEGMENTS.ALL;
    this.searchQuery = '';
    this.selectedStatus = 'All';
    this.currentPage = 1;
    this.selectedUserIds = new Set();
  }

  /**
   * Fetch users list from database API
   */
  async fetchUsers() {
    try {
      const response = await fetch(USERS_CONFIG.endpoints.fetchUsers);
      const result = await response.json();

      if (!response.ok) throw new Error(result.message || 'Failed to fetch users');

      this.usersList = result.data || [];
      this.applyFilters();
      return { success: true, count: this.usersList.length };
    } catch (error) {
      console.error('[UsersCore] Fetch Error:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Filter users by Search Query, Segment, and Status
   */
  applyFilters() {
    this.filteredUsers = this.usersList.filter(user => {
      const matchesSearch = !this.searchQuery ||
        (user.name && user.name.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
        (user.id && user.id.toLowerCase().includes(this.searchQuery.toLowerCase()));

      const matchesStatus = this.selectedStatus === 'All' || user.status === this.selectedStatus;

      let matchesSegment = true;
      if (this.selectedSegment === CRM_SEGMENTS.POWER_CREATORS) {
        matchesSegment = user.createdWishesCount >= 10;
      } else if (this.selectedSegment === CRM_SEGMENTS.DORMANT) {
        matchesSegment = user.isDormant === true;
      } else if (this.selectedSegment === CRM_SEGMENTS.REPORTED) {
        matchesSegment = user.isFlagged === true;
      }

      return matchesSearch && matchesStatus && matchesSegment;
    });

    this.currentPage = 1;
  }

  /**
   * Toggle Individual User Status (Active, Suspended, Banned)
   */
  async updateUserStatus(userId, newStatus) {
    try {
      const response = await fetch(USERS_CONFIG.endpoints.updateStatus, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status: newStatus })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to update status');

      const user = this.usersList.find(u => u.id === userId);
      if (user) user.status = newStatus;

      this.applyFilters();
      return { success: true };
    } catch (error) {
      console.error('[UsersCore] Status Update Error:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Toggle User Selection for Bulk Operations
   */
  toggleUserSelection(userId) {
    if (this.selectedUserIds.has(userId)) {
      this.selectedUserIds.delete(userId);
    } else {
      if (this.selectedUserIds.size < USERS_CONFIG.maxBulkSelection) {
        this.selectedUserIds.add(userId);
      }
    }
  }

  /**
   * Get Paginated Chunk of Users
   */
  getPaginatedUsers() {
    const startIndex = (this.currentPage - 1) * USERS_CONFIG.itemsPerPage;
    const endIndex = startIndex + USERS_CONFIG.itemsPerPage;
    return {
      items: this.filteredUsers.slice(startIndex, endIndex),
      totalPages: Math.ceil(this.filteredUsers.length / USERS_CONFIG.itemsPerPage) || 1,
      currentPage: this.currentPage,
      totalItems: this.filteredUsers.length
    };
  }
}

export const usersCoreInstance = new UsersCore();
