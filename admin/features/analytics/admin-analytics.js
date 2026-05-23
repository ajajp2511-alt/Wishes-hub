// Feature: Views Tracker (Admin Side)
window.trackView = async (wishId) => {
    const wishRef = db.collection("wishes").doc(wishId);
    
    // Firebase Increment operator se views count badhana
    await wishRef.update({
        views: firebase.firestore.FieldValue.increment(1)
    });
};

// Admin Dashboard par views dikhane ke liye
async function loadAnalytics() {
    const snapshot = await db.collection("wishes").orderBy("views", "desc").limit(5).get();
    const statsDiv = document.getElementById('stats-panel');
    
    statsDiv.innerHTML = "<h3>Top 5 Popular Wishes</h3>";
    snapshot.forEach(doc => {
        const data = doc.data();
        statsDiv.innerHTML += `<p>${data.text.substring(0,20)}... - <b>${data.views || 0} Views</b></p>`;
    });
}
