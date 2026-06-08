// Wishes Hub: Admin UI Event Controller
// Pure Event Listener (No Logic) - 2026

async function onFormSubmit(event) {
    event.preventDefault(); 

    const textInput = document.getElementById('admin-wish-text')?.value || "";
    const tgIdInput = document.getElementById('admin-tg-id')?.value || "";
    const categoryInput = document.getElementById('admin-category')?.value || "General";

    if (typeof window.processAndPublishWish === 'function') {
        
        const response = await window.processAndPublishWish(textInput, tgIdInput, categoryInput);

        if (response.ok) {
            alert("🚀 Success: Wish published to the secure stream successfully!");
            document.getElementById('admin-form')?.reset(); 
        } else {
            alert("🚨 Error: " + response.error); 
        }

    } else {
        console.error("Critical System Fault: processAndPublishWish function missing inside wishes.js");
        alert("🚨 Technical Fault: System core logic module is unreachable.");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const adminForm = document.getElementById('admin-form');
    if (adminForm) {
        adminForm.addEventListener('submit', onFormSubmit);
        console.log("Admin Event Module: Linked & Active");
    }
});
