document.addEventListener('DOMContentLoaded', async () => {
    // 1. Session Verification: Agar logged in nahi hai toh login page par bhejo
    if (localStorage.getItem('isAdminLoggedIn') !== 'true') {
        window.location.href = "/admin/pages/login.html";
        return;
    }

    console.log("Admin Panel Unlocked & Initialized!");

    // 2. Sidebar Dynamic Loader (Yeh aapke sidebar.html ko index.html me jodega)
    const adminWrapper = document.querySelector('.admin-wrapper');
    if (adminWrapper) {
        try {
            const response = await fetch('/admin/sidebar.html');
            if (response.status === 200) {
                const sidebarHtml = await response.text();
                
                // Content workspace se theek pehle sidebar HTML insert karein
                adminWrapper.insertAdjacentHTML('afterbegin', sidebarHtml);
                console.log("🎉 Sidebar Loaded Successfully!");
            } else {
                console.error("🚨 Sidebar file nahi mili (404)!");
            }
        } catch (error) {
            console.error("🚨 Sidebar load karne me dikkat aayi:", error);
        }
    }

    // 3. Default feature loading/click logic (Sidebar load hone ke thoda baad chalega)
    setTimeout(() => {
        if (typeof window.loadDefaultAdminView === 'function') {
            window.loadDefaultAdminView();
        } else {
            const defaultLink = document.querySelector('.nav-link[data-feature="wishes"]');
            if (defaultLink) {
                defaultLink.click();
            }
        }
        
        // Agar aapke 'ui-controller.js' me links par click events hain, 
        // toh use naye sidebar par apply karne ke liye re-initialize karna pad sakta hai
        if (typeof window.initSidebarEvents === 'function') {
            window.initSidebarEvents();
        }
    }, 200);
});
