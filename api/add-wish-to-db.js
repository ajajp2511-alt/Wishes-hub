// api/add-wish-to-db.js ke andar req.body se fileUrl nikal kar save karein

// ... (Firebase init code same rahega)

try {
    // Front-end payload se image url receive karna
    const { title, category, sub_category, message_id, fileUrl } = req.body; 

    const wishRef = db.collection('wishes').doc();
    const wishId = wishRef.id;

    await wishRef.set({
      wishId: wishId,
      title: title || '',
      category: category || 'General',
      sub_category: sub_category || '',
      imageUrl: fileUrl || null,  // 📸 FIXED: Image URL successfully database me jaayega
      telegramMessageId: message_id || null, 
      createdAt: new Date().toISOString()
    });

    // ... (Realtime DB code same rahega)
