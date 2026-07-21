const StorageCore = {
    data: {},
    API_URL: "", // Filhal blank rakhein ya apna sahi URL dein

    async init() {
        try {
            if (!this.API_URL || this.API_URL.includes("your-admin-panel-url")) {
                console.log("StorageManager: No Admin URL provided, skipping remote fetch.");
                return;
            }
            
            console.log("StorageManager: Fetching from Admin Panel...");
            const response = await fetch(this.API_URL);
            
            if (!response.ok) throw new Error("Admin Panel connection failed");
            
            this.data = await response.json();
            console.log("StorageManager: Data loaded from Admin.");
        } catch (e) {
            console.error("StorageManager: Error fetching data", e);
        }
    },

    getData(key) {
        return this.data[key];
    }
};

export default StorageCore;
