/**
 * Single Catch-All API Dispatcher (Wishes Hub - Ultra Robust Version)
 * Path: api/[...endpoint].js
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
        console.log("🔍 Incoming API Request URL:", req.url);
        console.log("🔍 Incoming Query Params:", req.query);

        // Robust Endpoint Extraction
        let endpointArr = req.query.endpoint;
        
        if (!endpointArr) {
            const urlPath = req.url.split('?')[0]; 
            const parts = urlPath.split('/').filter(Boolean); 
            if (parts.length > 0) {
                if (parts[0] === 'api') {
                    endpointArr = parts.slice(1);
                } else {
                    endpointArr = parts;
                }
            }
        }

        if (!endpointArr || (Array.isArray(endpointArr) && endpointArr.length === 0)) {
            return res.status(404).json({ ok: false, error: 'API Endpoint not specified.' });
        }

        const currentEndpoint = Array.isArray(endpointArr) ? endpointArr[0] : endpointArr;
        console.log("🎯 Resolved Target Endpoint:", currentEndpoint);

        let targetModule;
        
        // Helper to try importing from both relative paths (root vs api folder)
        const loadRouter = async (routerName) => {
            try {
                return await import(`../router/${routerName}.js`);
            } catch (err1) {
                try {
                    return await import(`./router/${routerName}.js`);
                } catch (err2) {
                    throw new Error(`Router file '${routerName}.js' not found in router/ or api/router/.`);
                }
            }
        };

        switch (currentEndpoint) {
            case 'verify-pass':
                targetModule = await loadRouter('verify-pass');
                break;
            case 'add-wish-to-db':
                targetModule = await loadRouter('add-wish-to-db');
                break;
            case 'add-unified-wish':
                targetModule = await loadRouter('add-unified-wish');
                break;
            case 'sheets':
                targetModule = await loadRouter('sheets');
                break;
            case 'get-wishes':
                targetModule = await loadRouter('get-wishes');
                break;
            case 'upload-to-tg':
                targetModule = await loadRouter('upload-to-tg');
                break;
            case 'ai-generator':
                targetModule = await loadRouter('ai-generator');
                break;
            case 'audit-logs':
                targetModule = await loadRouter('audit-logs');
                break;
            case 'cdn-upload':
                targetModule = await loadRouter('cdn-upload');
                break;
            case 'get-config':
                targetModule = await loadRouter('get-config');
                break;
            case 'get-image':
                targetModule = await loadRouter('get-image');
                break;
            case 'get-media':
                targetModule = await loadRouter('get-media');
                break;
            case 'get-youtube-song':
                targetModule = await loadRouter('get-youtube-song');
                break;
            case 'manage-wish':
                targetModule = await loadRouter('manage-wish');
                break;
            case 'save-security-config':
                targetModule = await loadRouter('save-security-config');
                break;
            case 'send-wish':
                targetModule = await loadRouter('send-wish');
                break;
            case 'system-analytics':
                targetModule = await loadRouter('system-analytics');
                break;
            case 'user-permissions':
                targetModule = await loadRouter('user-permissions');
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
        console.error("🚨 API Dispatcher Error:", error);
        return res.status(500).json({ 
            ok: false, 
            error: "Internal Server Error in API Dispatcher.", 
            details: error.message 
        });
    }
    }
