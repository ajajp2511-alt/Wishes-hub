const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Vercel frontend se aane wali requests ko allow karne ke liye

// Import your router or api handlers
// (Aapke project ke structure ke hisab se yahan api/router connect honge)

// Test Route (Render ko active rakhne / ping karne ke liye)
app.get('/', (req, res) => {
  res.json({ status: "success", message: "Wishes Hub Backend is running securely on Render!" });
});

// Example API Endpoint jo Render ke environment variables use karega
app.post('/api/save-wish', async (req, res) => {
  try {
    // 1. Security Check: Client se aayi hui key verify karein
    const clientKey = req.headers['x-api-key'];
    const serverSecret = process.env.WISHES_SECRET_KEY; // Render ke Environment Variables se aayega

    if (!clientKey || clientKey !== serverSecret) {
      return res.status(403).json({ error: "Unauthorized: Invalid API Key" });
    }

    const { wishMessage, userName } = req.body;

    // Yahan aap apna Telegram Bot ya Google Sheets ka code run kar sakte hain
    // Jo Render ke process.env.TELEGRAM_BOT_TOKEN ya baaki keys ko use karega

    res.json({ 
      status: "success", 
      message: "Wish successfully saved via Render backend!" 
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Render ke liye dynamic port binding (Zaroori hai)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Wishes Hub Server running on port ${PORT}`);
});
