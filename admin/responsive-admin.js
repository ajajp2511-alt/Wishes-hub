/* ==========================================
   📱 WISHES HUB ADMIN - RESPONSIVE LAYOUT ENGINE
   ========================================== */

/* 📑 TABLET WORKSPACE (Screens smaller than 1024px) */
@media screen and (max-width: 1024px) {
    .sidebar {
        width: 240px;
        padding: 20px 15px;
    }
    .content-workspace {
        margin-left: 240px;
        padding: 30px;
    }
}

/* 📲 ANDROID & IPHONE MOBILE VIEW (Screens smaller than 768px) */
@media screen and (max-width: 768px) {
    /* Main Panel Layout ko stacking me badlein */
    .admin-wrapper {
        flex-direction: column;
    }

    /* Sidebar Mobile par responsive Drawer ban jayega */
    .sidebar {
        width: 100%;
        height: auto;
        position: relative;
        padding: 20px;
        box-shadow: var(--shadow-sm);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .sidebar-header {
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    /* Menu options list mobile layout adjust grid */
    .nav-menu {
        flex-direction: row;
        flex-wrap: wrap;
        gap: 8px;
    }

    .nav-menu li {
        flex: 1 1 calc(50% - 8px); /* Mobile par buttons 2-column layout me ho jayenge */
        min-width: 130px;
    }

    .nav-link {
        padding: 10px 12px;
        font-size: 0.85rem;
        justify-content: center;
    }

    .nav-link .icon {
        margin-right: 6px;
        font-size: 1rem;
    }

    .logout-item {
        margin-top: 0;
        flex: 1 1 100% !important; /* Logout pura width lega mobile pe */
    }

    .btn-logout {
        padding: 10px;
        font-size: 0.85rem;
    }

    /* Workspace padding cleanup for small android screens */
    .content-workspace {
        margin-left: 0; /* Clear sidebar space constraint */
        padding: 20px 15px;
        width: 100%;
    }

    .feature-card {
        padding: 20px;
        border-radius: 12px;
    }

    .card-header {
        margin-bottom: 20px;
        padding-bottom: 12px;
    }

    .card-header h2 {
        font-size: 1.25rem;
    }

    /* Form Fields spacing for thumbs on Android touch */
    .form-group {
        margin-bottom: 16px;
    }

    .form-group select,
    .form-group input[type="text"],
    .form-group input[type="url"],
    .form-group textarea {
        padding: 12px;
        font-size: 0.9rem;
    }

    .primary-action-btn {
        padding: 12px;
        font-size: 0.95rem;
    }
}

/* 🪟 SMALL PHONES (Screens smaller than 380px) */
@media screen and (max-width: 380px) {
    .nav-menu li {
        flex: 1 1 100%; /* Ek row me ek hi button vertical stacking */
    }
}
