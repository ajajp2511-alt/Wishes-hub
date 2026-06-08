// Wishes Hub: Admin UI Event Controller
// Pure Event Listener (Sequence Management) - 2026

async function onFormSubmit(event) {
    event.preventDefault(); 

    // Extract UI Values
    const textInput = document.getElementById('admin-wish-text')?.value || "";
    const tgIdInput = document.getElementById('admin-tg-id')?.value || "";
    const categoryInput = document.getElementById('admin-category')?.value || "General";
    const passwordInput = document.getElementById('admin-password-field')?.value || "";

    // Security Rules Checklist
    if (typeof window.verifyAdminPassword !== 'function' || typeof window.publishWishToDatabase !== 'function') {
        alert("🚨 Critical System Fault: Logic modules are unreachable!");
        return;
    }

    // STEP 1: Run Password Verification Logic
    const authResponse = await window.verifyAdminPassword(passwordInput);
    if (!authResponse.ok) {
        alert("🚨 Access Denied: " + authResponse.error);
        return; 
    }

    // STEP 2: Run Wishes Upload Logic (If password is valid)
    const dbResponse = await window.publishWishToDatabase(textInput, tgIdInput, categoryInput, passwordInput);
    if (dbResponse.ok) {
        alert("🚀 Success: Password verified! Wish published successfully.");
        document.getElementById('admin-form')?.reset(); 
    } else {
        alert("🚨 Upload Failed: " + dbResponse.error);
    }
}

// Bind to Form HTML
document.addEventListener('DOMContentLoaded', () => {
    const adminForm = document.getElementById('admin-form');
    if (adminForm) {
        adminForm.addEventListener('submit', onFormSubmit);
        console.log("Admin Pipeline: Multi-Module Secure Sync Active");
    }
});
