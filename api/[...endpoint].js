/**
 * Single Catch-All API Dispatcher (Wishes Hub)
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
        const { endpoint: endpointArr } = req.query;
        
        if (!endpointArr || endpointArr.length === 0) {
            return res.status(404).json({ ok: false, error: 'API Endpoint not specified.' });
        }

        // Pehla segment endpoint name hoga (jaise verify-pass, sheets, add-wish-to-db)
        const currentEndpoint = endpointArr[0];

        let targetModule;
        
        switch (currentEndpoint) {
            case 'verify-pass':
                targetModule = await import('../router/verify-pass.js');
                break;
            case 'add-wish-to-db':
                targetModule = await import('../router/add-wish-to-db.js');
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
