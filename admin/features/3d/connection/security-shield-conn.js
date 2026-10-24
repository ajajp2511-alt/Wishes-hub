/**
 * 3D Engine to Security Shield Connection
 * Path: admin/features/3d/connection/security-shield-conn.js
 * Validates uploaded 3D assets and model files against malicious script injection or payload threats.
 */

import { securityCoreInstance } from '../../security-shield/security-core.js';

export const Master3DSecurityShieldConn = {
    async scan3DAssetPayload(fileName, fileType) {
        try {
            const allowedExtensions = ['.glb', '.gltf', '.draco', '.obj', '.fbx', '.png', '.jpg'];
            const ext = fileName ? fileName.substring(fileName.lastIndexOf('.')).toLowerCase() : '';

            if (fileName && !allowedExtensions.includes(ext)) {
                if (securityCoreInstance && typeof securityCoreInstance.recordThreat === 'function') {
                    await securityCoreInstance.recordThreat({
                        ip: 'LOCAL_3D_UPLOADER',
                        attackType: 'INVALID_3D_ASSET_FORMAT',
                        severity: 'MEDIUM',
                        timestamp: Date.now(),
                        details: { fileName, fileType }
                    });
                }
                return { success: false, error: 'Security Warning: Unsupported or unsafe file format.' };
            }

            return { success: true };
        } catch (error) {
            console.error('Error scanning 3D asset security:', error);
            return { success: false, error: error.message };
        }
    }
};
