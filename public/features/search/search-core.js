const SearchCore = {
    init() {
        const container = document.querySelector('.main-container');
        const searchBar = document.createElement('input');
        searchBar.type = 'text';
        searchBar.placeholder = 'Search wishes...';
        searchBar.style.cssText = "width: 90%; padding: 10px; margin: 10px; border-radius: 5px;";
        
        searchBar.addEventListener('input', (e) => this.handleSearch(e.target.value));
        container.prepend(searchBar);
    },

    handleSearch(query) {
        console.log("Searching for:", query);
        // Yahan filtering logic ayega jo StorageManager se data leke match karega
    }
};

export default SearchCore;
