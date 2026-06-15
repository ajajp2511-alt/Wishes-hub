// Wishes Hub: Master Assembly Script
// Patel Aura technology - 2026

async function startApp() {
    console.log("Wishes Hub: System Booting...");
    const grid = document.getElementById('wishes-grid');
    
    if(grid) {
        grid.innerHTML = "<p style='color:#00f2ff; padding:20px;'>Initializing Patel Studio Engine...</p>";
    }

    // 1. Firebase Configuration (From your evn.txt)
    const firebaseConfig = {
        apiKey: "AIzaSyDhqqHLeWTKGRc4-cHG2n8ALBt7zZFr8GQ",
        authDomain: "wishes-hub.firebaseapp.com",
        projectId: "wishes-hub",
        storageBucket: "wishes-hub.firebasestorage.app",
        messagingSenderId: "366690205259",
        appId: "1:366690205259:web:f82e09f5f8fd70dfd797ce"
    };

    try {
        // 2. Firebase Initialize
        if (typeof firebase !== 'undefined') {
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
                console.log("Firebase: Connected");
            }
        } else {
            throw new Error("Firebase SDK missing! index.html check karein.");
        }

        // 3. Storage & Categories Module Call
        // Note: Ye functions feat-storage.js mein hone chahiye
        if (typeof initStorage === 'function') {
            await initStorage();
            console.log("Storage: Loaded");
        } else {
            console.warn("initStorage function nahi mila. feat-storage.js check karein.");
        }

        if (typeof loadCategories === 'function') {
            await loadCategories();
            console.log("Categories: Loaded");
        }
        
        console.log("Wishes Hub: All Systems Online");

    } catch (error) {
        console.error("Boot Error:", error);
        if(grid) {
            grid.innerHTML = `
                <div style="color:#ff4444; padding:20px; border:1px solid #ff4444; border-radius:10px;">
                    <h3>Launch Error</h3>
                    <p>${error.message}</p>
                    <small>Check Console for details</small>
                </div>`;
        }
    }
}

// Start the engine
document.addEventListener('DOMContentLoaded', startApp);
