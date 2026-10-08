/**
 * Single Catch-All API Proxy to Render (Wishes Hub - Ultra Robust Version)
 * Path: api/[...endpoint].js
 */

export const config = {
    api: {
        bodyParser: true, 
    },
};

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-api-key'
    );

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        console.log("🔍 Incoming Vercel Proxy Request URL:", req.url);

        let currentEndpoint = '';

        if (req.query && req.query.endpoint) {
            currentEndpoint = Array.isArray(req.query.endpoint) ? req.query.endpoint.join('/') : req.query.endpoint;
        }

        if (!currentEndpoint) {
            const urlPath = req.url.split('?')[0]; 
            const parts = urlPath.split('/').filter(Boolean); 
            const apiIndex = parts.indexOf('api');
            if (apiIndex !== -1 && parts[apiIndex + 1]) {
                currentEndpoint = parts.slice(apiIndex + 1).join('/');
            } else if (parts.length > 0) {
                currentEndpoint = parts.join('/');
            }
        }

        if (!currentEndpoint) {
            return res.status(404).json({ ok: false, error: 'API Endpoint not specified.' });
        }

        // Clean endpoint to avoid double 'api/api' issue
        currentEndpoint = currentEndpoint.replace(/^api\//, '');

        console.log("🎯 Proxying to Clean Render Endpoint:", currentEndpoint);

        const RENDER_BACKEND_URL = "https://wishes-hub.onrender.com";
        
        const incomingUrl = new URL(req.url, `https://${req.headers.host || 'localhost'}`);
        const searchParams = incomingUrl.search;
        
        // Correct path concatenation
        const targetUrl = `${RENDER_BACKEND_URL}/api/${currentEndpoint}${searchParams}`;

        const headers = {};
        for (const [key, value] of Object.entries(req.headers)) {
            const lowerKey = key.toLowerCase();
            if (lowerKey !== 'host' && lowerKey !== 'connection' && lowerKey !== 'content-length') {
                headers[key] = value;
            }
        }
        headers['Host'] = 'wishes-hub.onrender.com';
        headers['Content-Type'] = 'application/json';

        const fetchOptions = {
            method: req.method,
            headers: headers
        };

        if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
            if (req.body) {
                fetchOptions.body = typeof req.body === 'object' ? JSON.stringify(req.body) : req.body;
            }
        }

        const backendResponse = await fetch(targetUrl, fetchOptions);
        const responseText = await backendResponse.text();

        res.status(backendResponse.status);
        const contentType = backendResponse.headers.get('content-type');
        if (contentType) {
            res.setHeader('content-type', contentType);
        }

        return res.send(responseText);

    } catch (error) {
        console.error("🚨 Vercel-to-Render Proxy Error:", error);
        return res.status(500).json({ 
            ok: false, 
            error: "Failed to communicate with Render backend proxy.", 
            details: error.message 
        });
    }
}
