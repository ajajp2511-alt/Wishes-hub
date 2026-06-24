// Wishes Hub: Main Router & Session Manager

document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;

    // 1. Session Check (Protect Dashboard)
    // Agar koi bina login kiye index.html par aane ki koshish kare
    if (currentPath.includes('index.html') || currentPath === '/admin/') {
        const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
        if (isLoggedIn !== 'true') {
            window.location.href = '/admin/login.html';
            return;
        }
    }

    // 2. Already Logged In Check (Skip Login Page)
    // Agar user pehle se logged in hai aur login.html kholta hai, toh use direct dashboard bhejo
    if (currentPath.includes('login.html')) {
        const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
        if (isLoggedIn === 'true') {
            window.location.href = '/admin/index.html';
            return;
        }
    }

    // 3. Global Logout Handler
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('isAdminLoggedIn'); // Session clear kiya
            window.location.href = '/admin/login.html'; // Login page par bheja
        });
    }
});
