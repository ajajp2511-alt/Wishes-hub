// Admin Logo Uploader Module - Wishes Hub
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-storage.js";
import { getDatabase, ref as dbRef, set, onValue } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

const storage = getStorage();
const database = getDatabase();
const dbLogoKey = 'settings/logoUrl';

const AdminLogoUploader = {
    init() {
        this.syncAdminUI();
        this.setupUploadTrigger();
    },

    // Realtime Database se current logo link lekar admin preview aur watermark update karna
    syncAdminUI() {
        const logoDataRef = dbRef(database, dbLogoKey);
        onValue(logoDataRef, (snapshot) => {
            const currentUrl = snapshot.val() || '../assets/default-logo.png';
            
            // 3. Admin Panel Header/Preview target elements update karein
            const previewTargets = document.querySelectorAll('.brand-logo-target');
            previewTargets.forEach(target => {
                target.innerHTML = `<img src="${currentUrl}" alt="Current Logo">`;
            });

            // 14. Admin Panel Background me dynamic watermark image inject karein
            this.injectAdminWatermark(currentUrl);
        });
    },

    injectAdminWatermark(url) {
        let watermark = document.getElementById('admin-layout-watermark');
        if (!watermark) {
            watermark = document.createElement('img');
            watermark.id = 'admin-layout-watermark';
            watermark.className = 'admin-bg-watermark-blur';
            document.body.appendChild(watermark);
        }
        watermark.src = url;
    },

    // Upload button click handling
    setupUploadTrigger() {
        const btnUpload = document.getElementById('btn-upload-logo');
        if (!btnUpload) return;

        btnUpload.addEventListener('click', async () => {
            const inputElement = document.getElementById('admin-logo-input');
            const statusBox = document.getElementById('upload-status');
            const file = inputElement.files[0];

            if (!file) {
                statusBox.innerText = "Kripya upload karne ke liye pehle ek photo select karein!";
                statusBox.style.color = "#d9534f";
                return;
            }

            statusBox.innerText = "Uploading to Firebase Storage...";
            statusBox.style.color = "#f0ad4e";

            try {
                // Fixed directory path me image store karna taaki dynamic links crash na ho
                const targetStorageRef = storageRef(storage, 'branding/wishes-hub-logo.png');
                await uploadBytes(targetStorageRef, file);
                
                // Permanent dynamic download URL nikalna
                const dynamicDownloadURL = await getDownloadURL(targetStorageRef);

                // Realtime Database update karna (jise user panel dynamic engine automatic catch kar lega)
                await set(dbRef(database, dbLogoKey), dynamicDownloadURL);

                statusBox.innerText = "Naya logo live ho chuka hai!";
                statusBox.style.color = "#5cb85c";
                inputElement.value = ''; // Input file clean karein
            } catch (err) {
                console.error("Admin upload engine error:", err);
                statusBox.innerText = "Upload fail hua! Firebase rules check karein.";
                statusBox.style.color = "#d9534f";
            }
        });
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    AdminLogoUploader.init();
});
