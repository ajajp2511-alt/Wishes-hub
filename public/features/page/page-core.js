const PageCore = {
    init() {
        console.log("PageManager: Navigation active.");
        window.addEventListener('hashchange', () => this.handleRoute());
        this.handleRoute();
    },

    handleRoute() {
        const hash = window.location.hash.replace('#', '') || 'home';
        const sections = document.querySelectorAll('.page-section');
        
        sections.forEach(sec => {
            sec.style.display = sec.id === hash ? 'block' : 'none';
        });
    }
};

export default PageCore;
