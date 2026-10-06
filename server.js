import express from 'express';
import cors from 'cors';

const app = express();

// 1. Middleware Setup
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'x-api-key']
}));
app.use(express.json());

// 2. Router Files Import karein (Aapke router folder ke mutabiq)
import addUnifiedWishRouter from './router/add-unified-wish.js';
import addWishToDbRouter from './router/add-wish-to-db.js';
import aiGeneratorRouter from './router/ai-generator.js';
import auditLogsRouter from './router/audit-logs.js';
import cdnUploadRouter from './router/cdn-upload.js';
import getConfigRouter from './router/get-config.js';
import getImageRouter from './router/get-image.js';
import getMediaRouter from './router/get-media.js';
import getWishesRouter from './router/get-wishes.js';
import getYoutubeSongRouter from './router/get-youtube-song.js';
import manageWishRouter from './router/manage-wish.js';
import saveSecurityConfigRouter from './router/save-security-config.js';

// 3. Routers ko /api ke sath mount karein
app.use('/api', addUnifiedWishRouter);
app.use('/api', addWishToDbRouter);
app.use('/api', aiGeneratorRouter);
app.use('/api', auditLogsRouter);
app.use('/api', cdnUploadRouter);
app.use('/api', getConfigRouter);
app.use('/api', getImageRouter);
app.use('/api', getMediaRouter);
app.use('/api', getWishesRouter);
app.use('/api', getYoutubeSongRouter);
app.use('/api', manageWishRouter);
app.use('/api', saveSecurityConfigRouter);

// Root route check karne ke liye ki server live hai ya nahi
app.get('/', (req, res) => {
    res.status(200).json({ status: 'success', message: 'Wishes Hub Backend is live on Render!' });
});

// 4. Server Listen Setup (Render automatic PORT assign karta hai)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running live on port ${PORT}`);
});
