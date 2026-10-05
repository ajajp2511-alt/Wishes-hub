import express from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Test Route (Render ko active rakhne ke liye)
app.get('/', (req, res) => {
  res.json({ status: "success", message: "Wishes Hub Backend is running securely on Render!" });
});

// Wish Save API Endpoint
app.post('/api/save-wish', async (req, res) => {
  try {
    const clientKey = req.headers['x-api-key'];
    const serverSecret = process.env.WISHES_SECRET_KEY;

    if (!clientKey || clientKey !== serverSecret) {
      return res.status(403).json({ error: "Unauthorized: Invalid API Key" });
    }

    const { wishMessage, userName } = req.body;

    // Yahan aapka Firebase ya baaki database ka logic aayega

    res.json({ 
      status: "success", 
      message: "Wish successfully saved via Render backend!" 
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Wishes Hub Server running on port ${PORT}`);
});
