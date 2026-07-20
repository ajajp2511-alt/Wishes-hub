const StorageCore = {
    data: {},
    // Admin panel ka endpoint yahan define hoga
    API_URL: "https://your-admin-panel-url.com/api/v1/data", 

    async init() {
        try {
            console.log("StorageManager: Fetching from Admin Panel...");
            const response = await fetch(this.API_URL);
            
            if (!response.ok) throw new Error("Admin Panel connection failed");
            
            this.data = await response.json();
            console.log("StorageManager: Data loaded from Admin.");
        } catch (e) {
            console.error("StorageManager: Fallback to local data", e);
            // Agar Admin Panel down ho toh local JSON use karenge
            await this.loadLocalBackup();
        }
    },

    async loadLocalBackup() {
        const response = await fetch('/public/data/global-config.json');
        this.data = await response.json();
    },

    getData(key) {
        return this.data[key];
    }
};

export default StorageCore;
