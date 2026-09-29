/**
 * Single Catch-All API Dispatcher (Wishes Hub)
 * Path: api/[...endpoint].js
 * Updated with all router modules
 */

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const { endpoint: endpointArr } = req.query;
        
        if (!endpointArr || endpointArr.length === 0) {
            return res.status(404).json({ ok: false, error: 'API Endpoint not specified.' });
        }

        const currentEndpoint = endpointArr[0];
        let targetModule;
        
        switch (currentEndpoint) {
            case 'verify-pass':
                targetModule = await import('../router/verify-pass.js');
                break;
            case 'add-wish-to-db':
                targetModule = await import('../router/add-wish-to-db.js');
                break;
            case 'add-unified-wish':
                targetModule = await import('../router/add-unified-wish.js');
                break;
            case 'sheets':
                targetModule = await import('../router/sheets.js');
                break;
            case 'get-wishes':
                targetModule = await import('../router/get-wishes.js');
                break;
            case 'upload-to-tg':
                targetModule = await import('../router/upload-to-tg.js');
                break;
            case 'ai-generator':
                targetModule = await import('../router/ai-generator.js');
                break;
            case 'audit-logs':
                targetModule = await import('../router/audit-logs.js');
                break;
            case 'cdn-upload':
                targetModule = await import('../router/cdn-upload.js');
                break;
            case 'get-config':
                targetModule = await import('../router/get-config.js');
                break;
            case 'get-image':
                targetModule = await import('../router/get-image.js');
                break;
            case 'get-media':
                targetModule = await import('../router/get-media.js');
                break;
            case 'get-youtube-song':
                targetModule = await import('../router/get-youtube-song.js');
                break;
            case 'manage-wish':
                targetModule = await import('../router/manage-wish.js');
                break;
            case 'save-security-config':
                targetModule = await import('../router/save-security-config.js');
                break;
            case 'send-wish':
                targetModule = await import('../router/send-wish.js');
                break;
            case 'system-analytics':
                targetModule = await import('../router/system-analytics.js');
                break;
            case 'user-permissions':
                targetModule = await import('../router/user-permissions.js');
                break;
            default:
                return res.status(404).json({ ok: false, error: `Endpoint '${currentEndpoint}' not found in router registry.` });
        }

        if (targetModule && typeof targetModule.default === 'function') {
            return await targetModule.default(req, res);
        } else {
            return res.status(500).json({ ok: false, error: `Endpoint handler for '${currentEndpoint}' is invalid.` });
        }

    } catch (error) {
        console.error("API Dispatcher Error:", error);
        return res.status(500).json({ 
            ok: false, 
            error: "Internal Server Error in API Dispatcher.", 
            details: error.message 
        });
    }
}
