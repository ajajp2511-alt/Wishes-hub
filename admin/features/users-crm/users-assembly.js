/**
 * Users & CRM Module - UI Assembly & Controller
 * Path: admin/features/users-crm/users-assembly.js
 */

import { USER_STATUSES, CRM_SEGMENTS } from './users-config.js';
import { usersCoreInstance } from './users-core.js';
import { usersActivityInstance } from './users-activity.js';
import { usersPrivacyInstance } from './users-privacy.js';

export class UsersAssembly {
  constructor() {
    this.container = null;
    this.activeTab = 'all-users';
  }

  /**
   * Initialize and render CRM feature into DOM
   */
  async init(rootId) {
    this.container = document.getElementById(rootId);
    if (!this.container) return;

    this.renderSkeleton();
    this.attachEventListeners();
    await this.loadUsersData();
  }

  /**
   * Render Base Layout & Toolbar
   */
  renderSkeleton() {
    this.container.innerHTML = `
      <div class="crm-container">
        <!-- Sub Header Controls -->
        <header class="crm-header">
          <div class="crm-tabs">
            <button class="tab-btn active" data-tab="all-users">All Registered Users</button>
            <button class="tab-btn" data-tab="user-activity">User Activity</button>
            <button class="tab-btn" data-tab="saved-wishes">Saved Wishes</button>
            <button class="tab-btn" data-tab="privacy-vault">Privacy Vault</button>
          </div>
          <div class="crm-actions">
            <input type="text" id="crm-search-input" placeholder="Search by name, email or ID..." />
            <select id="crm-status-filter">
              <option value="All">All Statuses</option>
              <option value="${USER_STATUSES.ACTIVE}">${USER_STATUSES.ACTIVE}</option>
              <option value="${USER_STATUSES.SUSPENDED}">${USER_STATUSES.SUSPENDED}</option>
              <option value="${USER_STATUSES.BANNED}">${USER_STATUSES.BANNED}</option>
            </select>
          </div>
        </header>

        <!-- Main Data View -->
        <main id="crm-main-view" class="crm-main-view">
          <div class="crm-loading">Loading CRM Data...</div>
        </main>

        <!-- Pagination Bar -->
        <footer id="crm-pagination" class="crm-pagination"></footer>
      </div>

      <!-- User Profile Drawer Panel -->
      <div id="user-drawer" class="user-drawer hidden">
        <div class="drawer-header">
          <h3>User Profile Details</h3>
          <button id="btn-close-drawer" class="close-btn">&times;</button>
        </div>
        <div id="drawer-body" class="drawer-body"></div>
      </div>
    `;
  }

  /**
   * Fetch and Render User List Data
   */
  async loadUsersData() {
    const mainView = this.container.querySelector('#crm-main-view');
    mainView.innerHTML = `<div class="crm-loading">Fetching Users...</div>`;

    await usersCoreInstance.fetchUsers();
    this.renderTable();
  }

  /**
   * Render User Table
   */
  renderTable() {
    const mainView = this.container.querySelector('#crm-main-view');
    const paginated = usersCoreInstance.getPaginatedUsers();

    if (paginated.items.length === 0) {
      mainView.innerHTML = `<div class="crm-empty">No users found matching criteria.</div>`;
      return;
    }

    mainView.innerHTML = `
      <table class="crm-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name & Email</th>
            <th>Status</th>
            <th>Joined Date</th>
            <th>Wishes Count</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${paginated.items.map(user => `
            <tr>
              <td><code>${user.id}</code></td>
              <td>
                <div class="user-cell">
                  <span class="user-name">${user.name || 'Anonymous User'}</span>
                  <span class="user-email">${usersPrivacyInstance.anonymizePII(user.email)}</span>
                </div>
              </td>
              <td><span class="badge badge-${(user.status || 'active').toLowerCase()}">${user.status || 'Active'}</span></td>
              <td>${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
              <td>${user.createdWishesCount || 0}</td>
              <td>
                <div class="action-buttons">
                  <button class="btn-sm btn-view-user" data-id="${user.id}">Inspect</button>
                  <button class="btn-sm btn-status-toggle" data-id="${user.id}" data-status="${user.status === 'Banned' ? 'Active' : 'Banned'}">
                    ${user.status === 'Banned' ? 'Unban' : 'Ban'}
                  </button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  /**
   * Attach Listeners for Tabs, Search, and Status Controls
   */
  attachEventListeners() {
    // Tab Navigation
    this.container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.activeTab = e.target.dataset.tab;
        this.renderTable();
      });
    });

    // Search Filter Input
    const searchInput = this.container.querySelector('#crm-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        usersCoreInstance.searchQuery = e.target.value;
        usersCoreInstance.applyFilters();
        this.renderTable();
      });
    }

    // Status Filter Dropdown
    const statusSelect = this.container.querySelector('#crm-status-filter');
    if (statusSelect) {
      statusSelect.addEventListener('change', (e) => {
        usersCoreInstance.selectedStatus = e.target.value;
        usersCoreInstance.applyFilters();
        this.renderTable();
      });
    }

    // Table Actions (Inspect & Ban/Unban)
    this.container.addEventListener('click', async (e) => {
      if (e.target.classList.contains('btn-status-toggle')) {
        const userId = e.target.dataset.id;
        const newStatus = e.target.dataset.status;
        await usersCoreInstance.updateUserStatus(userId, newStatus);
        this.renderTable();
      }
    });
  }
}

export const usersAssemblyInstance = new UsersAssembly();
