const UiCore = {
    async loadLayout() {
        // Simple Header Template
        const headerHTML = `
            <header class="main-header">
                <h1>Wishes-hub</h1>
                <nav id="header-actions">
                    <button onclick="window.location.href='/'">Home</button>
                    <button id="theme-toggle">Theme</button>
                </nav>
            </header>
        `;
        
        // Simple Footer Template
        const footerHTML = `
            <footer class="main-footer">
                <p>&copy; 2026 Wishes-hub | All Rights Reserved</p>
                <div class="footer-links">
                    <a href="about.html">About</a> | <a href="privacy.html">Privacy</a>
                </div>
            </footer>
        `;

        document.body.insertAdjacentHTML('afterbegin', headerHTML);
        document.body.insertAdjacentHTML('beforeend', footerHTML);
    }
};
export default UiCore;
