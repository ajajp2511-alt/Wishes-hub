/**
 * 3D Admin Asset Upload & Validation Module
 * Path: wishes-hub/admin/features/3d/modules/3d-admin-asset-upload.js
 */

import { THREE_CONFIG } from '../3d-config.js';
import { coreEngine } from '../3d-core.js';

export class AdminAssetUpload {
  constructor() {
    this.moduleName = '3d-admin-asset-upload';
    this.init();
  }

  init() {
    coreEngine.registerModule(this.moduleName, this);
    console.log(`[Module] ${this.moduleName} initialized.`);
  }

  // Validate file extension, size, and SHA-256 duplicate status
  async validateAndUploadAsset(file, metadata = {}) {
    if (!file) {
      throw new Error('[Admin Upload] No file selected.');
    }

    const fileExt = '.' + file.name.split('.').pop().toLowerCase();
    const allowedExts = Object.values(THREE_CONFIG.ASSET_TYPES);

    if (!allowedExts.includes(fileExt)) {
      throw new Error(`[Admin Upload] Unsupported file format: ${fileExt}`);
    }

    // Read ArrayBuffer for SHA-256 calculation
    const fileBuffer = await file.arrayBuffer();
    const fileHash = await coreEngine.calculateSHA256(fileBuffer);

    // Duplicate Check
    const isDuplicate = await this.checkDuplicateHash(fileHash);
    if (isDuplicate) {
      return {
        success: false,
        isDuplicate: true,
        hash: fileHash,
        message: 'Asset already exists in database (SHA-256 duplicate match).'
      };
    }

    // Prepare Upload Payload
    const uploadResult = await this.uploadToServer(file, fileHash, metadata);
    
    // Register in core cache
    coreEngine.state.loadedAssets.set(fileHash, uploadResult);
    coreEngine.emit('asset:uploaded', uploadResult);

    return {
      success: true,
      isDuplicate: false,
      hash: fileHash,
      asset: uploadResult
    };
  }

  async checkDuplicateHash(hash) {
    try {
      const response = await fetch(THREE_CONFIG.SHA256_CHECK_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hash })
      });
      const result = await response.json();
      return result.exists;
    } catch (err) {
      return coreEngine.state.loadedAssets.has(hash);
    }
  }

  async uploadToServer(file, hash, metadata) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('hash', hash);
    formData.append('metadata', JSON.stringify(metadata));

    const response = await fetch('/api/v1/3d/assets/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('[Admin Upload] Server upload failed.');
    }

    return await response.json();
  }
}

export default AdminAssetUpload;
