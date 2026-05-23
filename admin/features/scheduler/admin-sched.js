// Feature: Schedule Logic
async function schedulePost() {
    const postTime = document.getElementById('schedule-time').value; // Date-time input
    const wishData = {
        text: document.getElementById('wishInput').value,
        publishAt: new Date(postTime),
        status: "scheduled"
    };

    await db.collection("scheduled_wishes").add(wishData);
    alert("Post scheduled for: " + postTime);
}

// Frontend (feat-storage.js) mein ye check add karein:
// wishes.filter(w => !w.publishAt || w.publishAt.toDate() <= new Date())
