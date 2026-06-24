document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;

    // 1. Protection Router (Dashboard Security)
    if (currentPath.includes('index.html') || currentPath === '/admin/') {
        if (localStorage.getItem('isAdminLoggedIn') !== 'true') {
            window.location.href = '/admin/pages/login.html';
            return;
        }
    }

    // 2. Already Logged In Redirect
    if (currentPath.includes('login.html')) {
        if (localStorage.getItem('isAdminLoggedIn') === 'true') {
            window.location.href = '/admin/index.html';
            return;
        }
    }

    // 3. Global Logout Trigger Handler
    document.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'logout-btn') {
            e.preventDefault();
            localStorage.removeItem('isAdminLoggedIn'); // Session clear
            window.location.href = '/admin/pages/login.html'; // Redirect to login
        }
    });
});
