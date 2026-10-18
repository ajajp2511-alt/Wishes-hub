/**
 * 3D Asset Telegram Scraper & Background Sync Module
 * Path: wishes-hub/admin/features/3d/modules/3d-asset-telegram-sync.js
 */

import { THREE_CONFIG } from '../3d-config.js';
import { coreEngine } from '../3d-core.js';

export class AssetTelegramSync {
  constructor() {
    this.moduleName = '3d-asset-telegram-sync';
    this.init();
  }

  init() {
    coreEngine.registerModule(this.moduleName, this);
    console.log(`[Module] ${this.moduleName} initialized.`);
  }

  // Fetch and sync files from Telegram channel/chat source
  async syncChannelAssets(channelId, botToken = process.env.TELEGRAM_BOT_TOKEN) {
    if (!channelId || !botToken) {
      throw new Error('[Telegram Sync] Missing channel ID or bot token.');
    }

    try {
      const url = `${THREE_CONFIG.TELEGRAM_BOT_API}${botToken}/getUpdates`;
      const response = await fetch(url);
      const data = await response.json();

      if (!data.ok) {
        throw new Error(`[Telegram Sync Error] ${data.description}`);
      }

      const processedAssets = [];
      for (const update of data.result) {
        const message = update.message || update.channel_post;
        if (message && (message.document || message.audio || message.video)) {
          const fileMeta = await this.processTelegramFile(message, botToken);
          if (fileMeta) {
            processedAssets.push(fileMeta);
          }
        }
      }

      coreEngine.emit('telegram:sync:complete', { count: processedAssets.length });
      return processedAssets;
    } catch (error) {
      console.error('[Telegram Sync Failed]', error);
      throw error;
    }
  }

  // Process individual Telegram file and check SHA-256 deduplication
  async processTelegramFile(message, botToken) {
    const doc = message.document || message.audio || message.video;
    const fileId = doc.file_id;
    const fileName = doc.file_name || `telegram_asset_${Date.now()}`;

    // Get file path from Telegram
    const fileUrlRes = await fetch(`${THREE_CONFIG.TELEGRAM_BOT_API}${botToken}/getFile?file_id=${fileId}`);
    const fileUrlData = await fileUrlRes.json();

    if (!fileUrlData.ok) return null;

    const filePath = fileUrlData.result.file_path;
    const downloadUrl = `https://api.telegram.org/file/bot${botToken}/${filePath}`;

    // Download file buffer for hash validation
    const fileRes = await fetch(downloadUrl);
    const fileBuffer = await fileRes.arrayBuffer();

    // Compute SHA-256 for deduplication
    const fileHash = await coreEngine.calculateSHA256(fileBuffer);

    // Check if hash already exists in storage
    const isDuplicate = await this.checkDuplicateHash(fileHash);
    if (isDuplicate) {
      console.log(`[Deduplication] Skipped duplicate asset hash: ${fileHash}`);
      return null;
    }

    return {
      fileName,
      fileHash,
      fileSize: doc.file_size,
      downloadUrl,
      source: 'telegram',
      timestamp: Date.now()
    };
  }

  // Verify hash against server database
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
      console.warn('[Hash Check Warning] Server check failed, proceeding with local map cache.');
      return coreEngine.state.loadedAssets.has(hash);
    }
  }
}

export default AssetTelegramSync;
