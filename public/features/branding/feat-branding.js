// Feature: Centralized Branding & Logo Manager
window.BrandingManager = {
    // 1. Database se Logo fetch karke apply karna
    loadLogos: async function() {
        try {
            const doc = await db.collection("app_config").doc("branding").get();
            if (doc.exists) {
                const data = doc.data();
                this.applyLogos(data.logoUrl, data.faviconUrl);
            } else {
                // Default logo agar DB mein kuch na ho
                this.applyLogos('/assets/default-logo.png', '/favicon.ico');
            }
        } catch (error) {
            console.error("Logo Load Error:", error);
        }
    },

    // 2. DOM mein logo ko update karna
    applyLogos: function(logoUrl, favUrl) {
        // Website ke saare logos ko update karein
        if (logoUrl) {
            const logoElements = document.querySelectorAll('.app-logo');
            logoElements.forEach(img => {
                img.src = logoUrl;
                img.alt = "Wishes Hub Logo";
            });
        }

        // Browser tab ka favicon update karein
        if (favUrl) {
            let link = document.querySelector("link[rel*='icon']");
            if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.head.appendChild(link);
            }
            link.href = favUrl;
        }
    }
};
