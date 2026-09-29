/**
 * Single Catch-All API Dispatcher (Wishes Hub - Ultra Robust Version)
 * Path: api/[...endpoint].js
 */

import * as verifyPassModule from '../router/verify-pass.js';
import * as addWishToDbModule from '../router/add-wish-to-db.js';
import * as addUnifiedWishModule from '../router/add-unified-wish.js';
import * as sheetsModule from '../router/sheets.js';
import * as getWishesModule from '../router/get-wishes.js';
import * as uploadToTgModule from '../router/upload-to-tg.js';
import * as aiGeneratorModule from '../router/ai-generator.js';
import * as auditLogsModule from '../router/audit-logs.js';
import * as cdnUploadModule from '../router/cdn-upload.js';
import * as getConfigModule from '../router/get-config.js';
import * as getImageModule from '../router/get-image.js';
import * as getMediaModule from '../router/get-media.js';
import * as getYoutubeSongModule from '../router/get-youtube-song.js';
import * as manageWishModule from '../router/manage-wish.js';
import * as saveSecurityConfigModule from '../router/save-security-config.js';
import * as sendWishModule from '../router/send-wish.js';
import * as systemAnalyticsModule from '../router/system-analytics.js';
import * as userPermissionsModule from '../router/user-permissions.js';

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

        switch (currentEndpoint) {
            case 'verify-pass':
                targetModule = verifyPassModule;
                break;
            case 'add-wish-to-db':
                targetModule = addWishToDbModule;
                break;
            case 'add-unified-wish':
                targetModule = addUnifiedWishModule;
                break;
            case 'sheets':
                targetModule = sheetsModule;
                break;
            case 'get-wishes':
                targetModule = getWishesModule;
                break;
            case 'upload-to-tg':
                targetModule = uploadToTgModule;
                break;
            case 'ai-generator':
                targetModule = aiGeneratorModule;
                break;
            case 'audit-logs':
                targetModule = auditLogsModule;
                break;
            case 'cdn-upload':
                targetModule = cdnUploadModule;
                break;
            case 'get-config':
                targetModule = getConfigModule;
                break;
            case 'get-image':
                targetModule = getImageModule;
                break;
            case 'get-media':
                targetModule = getMediaModule;
                break;
            case 'get-youtube-song':
                targetModule = getYoutubeSongModule;
                break;
            case 'manage-wish':
                targetModule = manageWishModule;
                break;
            case 'save-security-config':
                targetModule = saveSecurityConfigModule;
                break;
            case 'send-wish':
                targetModule = sendWishModule;
                break;
            case 'system-analytics':
                targetModule = systemAnalyticsModule;
                break;
            case 'user-permissions':
                targetModule = userPermissionsModule;
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
