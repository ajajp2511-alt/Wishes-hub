/**
 * Assets & Inventory Hub - File Uploader & External Link Parser
 * Path: admin/features/assets/assets-uploader.js
 */

import { ASSET_CONFIG } from './assets-config.js';

export class AssetsUploader {
  /**
   * Validate uploaded file size and type
   */
  static validateFile(file) {
    const maxSizeBytes = ASSET_CONFIG.maxFileSizeMB * 1024 * 1024;

    if (file.size > maxSizeBytes) {
      return { valid: false, error: `File size exceeds limit (${ASSET_CONFIG.maxFileSizeMB} MB)` };
    }

    const allAllowedTypes = [
      ...ASSET_CONFIG.allowedImageFormats,
      ...ASSET_CONFIG.allowedAudioFormats,
      ...ASSET_CONFIG.allowedFontFormats
    ];

    if (!allAllowedTypes.includes(file.type)) {
      return { valid: false, error: 'Unsupported file format' };
    }

    return { valid: true };
  }

  /**
   * Bulk Upload Files to CDN
   */
  static async uploadBatch(files, onProgress = () => {}) {
    const results = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validation = this.validateFile(file);

      if (!validation.valid) {
        results.push({ file: file.name, status: 'error', message: validation.error });
        continue;
      }

      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(ASSET_CONFIG.cdnEndpoints.upload, {
          method: 'POST',
          body: formData
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'CDN Upload Failed');

        results.push({ file: file.name, status: 'success', cdnUrl: data.url, metadata: data });
      } catch (err) {
        results.push({ file: file.name, status: 'error', message: err.message });
      }

      onProgress(Math.round(((i + 1) / files.length) * 100));
    }

    return results;
  }

  /**
   * Parse External Audio / Image / Lottie CDN Links directly
   */
  static parseExternalUrl(urlStr) {
    try {
      const parsedUrl = new URL(urlStr);
      let assetType = 'unknown';

      if (urlStr.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i)) {
        assetType = 'image';
      } else if (urlStr.match(/\.(mp3|wav|ogg|aac)$/i)) {
        assetType = 'audio';
      } else if (urlStr.includes('lottiefiles.com') || urlStr.match(/\.json$/i)) {
        assetType = 'lottie';
      }

      return { valid: true, url: parsedUrl.href, inferredType: assetType };
    } catch {
      return { valid: false, error: 'Invalid URL format' };
    }
  }
}
