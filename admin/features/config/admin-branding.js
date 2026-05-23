// Admin Feature: Logo Upload & Storage
async function updateStudioBranding() {
    const logoFile = document.getElementById('logoInput').files[0];
    const favFile = document.getElementById('faviconInput').files[0];
    let updates = {};

    showToast("Uploading logos...", "info");

    if (logoFile) {
        const ref = firebase.storage().ref('branding/main-logo.png');
        await ref.put(logoFile);
        updates.logoUrl = await ref.getDownloadURL();
    }

    if (favFile) {
        const ref = firebase.storage().ref('branding/favicon.ico');
        await ref.put(favFile);
        updates.faviconUrl = await ref.getDownloadURL();
    }

    if (Object.keys(updates).length > 0) {
        await db.collection("app_config").doc("branding").set(updates, { merge: true });
        showToast("Branding updated successfully!", "success");
        // Website par turant badlav dikhane ke liye
        BrandingManager.applyLogos(updates.logoUrl, updates.faviconUrl);
    }
}
