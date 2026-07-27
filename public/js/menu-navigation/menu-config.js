/* Updated Menu Navigation Config */
export const MenuConfig = {
    containerId: 'menu-navigation-container',
    
    // Complete Side Drawer Navigation List
    drawerItems: [
        // 1. Core Navigation Pages
        { id: 'nav-home', label: 'Home', icon: '🏠', link: '/' },
        { id: 'nav-shop', label: 'Affiliate Shop', icon: '🛍️', link: '/shop.html' },
        { id: 'nav-favorite', label: 'Favorite', icon: '❤️', link: '#favorite' },
        { id: 'nav-saved', label: 'Saved', icon: '🔖', link: '#saved' },

        // 2. Format & Content Type Filters
        { id: 'nav-text-wishes', label: 'Text Wishes', icon: '📝', link: '#text-wishes' },
        { id: 'nav-image-wishes', label: 'Image Wishes', icon: '🖼️', link: '#image-wishes' },

        // 3. Smart & Interactive Tools
        { id: 'nav-ai-gen', label: 'AI Wish Generator', icon: '🤖', link: '#ai-generator' },
        { id: 'nav-card-gen', label: 'Wish Card Generator', icon: '💌', link: '#card-generator' },
        { id: 'nav-calendar', label: 'Festival Calendar 2026', icon: '📅', link: '#calendar' },

        // 4. Utility & Compliance
        { id: 'nav-about', label: 'About Us', icon: 'ℹ️', link: '/about.html' },
        { id: 'nav-contact', label: 'Contact Us', icon: '📞', link: '/contact.html' }
    ]
};
