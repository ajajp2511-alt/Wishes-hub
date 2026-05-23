// Feature: Unlimited Data Fetching & Rendering
const firebaseConfig = {
    // Ye keys hum baad mein .env se link karenge
    apiKey: "YOUR_API_KEY",
    authDomain: "your-app.firebaseapp.com",
    projectId: "your-app-id",
    storageBucket: "your-app.appspot.com",
    messagingSenderId: "your-id",
    appId: "your-app-id"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
let allWishes = [];

// Data Fetch karne ka function
async function initStorage() {
    console.log("Fetching Unlimited Wishes...");
    db.collection("wishes").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
        allWishes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderWishes(allWishes);
    });
}

// Grid mein data render karne ka function
function renderWishes(data) {
    const grid = document.getElementById('wishes-grid');
    grid.innerHTML = data.map(wish => `
        <div class="wish-card" id="card-${wish.id}">
            <p class="wish-text" id="text-${wish.id}">${wish.text}</p>
            <div class="card-controls">
                <button onclick="openEditor('${wish.id}')">Edit Style</button>
                <button onclick="triggerDownload('${wish.id}')">Download</button>
            </div>
        </div>
    `).join('');
}
