// admin/features/wishes/wishes.js

// Image to Base64 helper function
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

window.uploadToTelegram = async function(formData) {
    // Normal fields extract karein
    const title = formData.get('title');
    const category = formData.get('category');
    const sub_category = formData.get('sub_category');
    const imageFile = formData.get('image');

    // JSON payload banayein
    const jsonPayload = {
        title: title,
        category: category,
        sub_category: sub_category,
        image: null
    };

    // Agar image select ki hai toh use base64 me convert karein
    if (imageFile && imageFile.size > 0) {
        try {
            jsonPayload.image = await fileToBase64(imageFile);
        } catch (e) {
            console.error("Base64 Conversion Failed", e);
        }
    }

    // Server ko content-type JSON bhejenge
    const res = await fetch('/api/upload-to-tg', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonPayload) 
    });
    
    const contentType = res.headers.get("content-type");
    if (!res.ok || (contentType && !contentType.includes("application/json"))) {
        const errorText = await res.text();
        throw new Error(`Server Error (${res.status}): ${errorText.substring(0, 100)}`);
    }
    
    return await res.json();
};

window.saveToDatabase = async function(payload) {
    const res = await fetch('/api/add-wish-to-db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    
    const contentType = res.headers.get("content-type");
    if (!res.ok || (contentType && !contentType.includes("application/json"))) {
        const errorText = await res.text();
        throw new Error(`DB Server Error (${res.status}): ${errorText.substring(0, 100)}`);
    }

    return await res.json();
};
