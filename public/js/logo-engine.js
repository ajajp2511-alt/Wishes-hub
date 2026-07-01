// Logo Engine - Wishes Hub
const LogoEngine = {
    // Default logo agar firebase se load na ho
    defaultLogo: 'assets/default-logo.png',

    init(logoUrl) {
        const targetUrl = logoUrl || this.defaultLogo;
        
        this.updateHeaders(targetUrl);
        this.updateFavicon(targetUrl);
        this.updateWatermarks(targetUrl);
        this.updateSplashLogo(targetUrl);
        this.updateMetaTags(targetUrl);
    },

    // 1, 3, 7, 12. Headers, Footer aur Login screens ke liye
    updateHeaders(url) {
        const logoContainers = document.querySelectorAll('.brand-logo-target');
        logoContainers.forEach(container => {
            container.innerHTML = `<img src="${url}" alt="Wishes Hub" class="brand-logo-img">`;
        });
    },

    // 2. Browser Tab (Favicon)
    updateFavicon(url) {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = url;
    },

    // 14. Background Watermark Integration
    updateWatermarks(url) {
        let watermark = document.getElementById('global-panel-watermark');
        if (!watermark) {
            watermark = document.createElement('img');
            watermark.id = 'global-panel-watermark';
            watermark.className = 'panel-watermark-bg';
            document.body.appendChild(watermark);
        }
        watermark.src = url;
    },

    // 5. Loading / Splash Screen
    updateSplashLogo(url) {
        const splashImg = document.getElementById('splash-logo-node');
        if (splashImg) splashImg.src = url;
    },

    // 4, 6, 10. Social Meta tags aur App icons
    updateMetaTags(url) {
        // WhatsApp/OG Share Image
        let ogImg = document.querySelector('meta[property="og:image"]');
        if (ogImg) ogImg.setAttribute('content', url);

        // Apple Touch Icon (App Shortcut)
        let appleIcon = document.querySelector('link[rel="apple-touch-icon"]');
        if (appleIcon) appleIcon.setAttribute('href', url);
    },

    // Splash screen ko hide karne ke liye utility
    hideSplash() {
        const splash = document.getElementById('wishes-splash');
        if (splash) {
            setTimeout(() => {
                splash.classList.add('splash-hidden');
            }, 800); // Halka smooth delay
        }
    }
};
