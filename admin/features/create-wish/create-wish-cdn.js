/**
 * Create Wish Feature - CDN Media Compressor & Upload Engine
 * Path: admin/features/create-wish/create-wish-cdn.js
 */

export class CreateWishCDN {
  constructor() {
    this.uploadEndpoint = '/api/cdn-upload';
  }

  /**
   * Compress Image File before Uploading
   */
  async compressImage(file, maxWidth = 1200, quality = 0.8) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              resolve(new File([blob], file.name, { type: 'image/jpeg' }));
            },
            'image/jpeg',
            quality
          );
        };
      };
    });
  }

  /**
   * Upload Media File to CDN Serverless API
   */
  async uploadMedia(file, folder = 'wishes_media') {
    try {
      let fileToUpload = file;

      // Auto-compress if image
      if (file.type.startsWith('image/')) {
        fileToUpload = await this.compressImage(file);
      }

      const formData = new FormData();
      formData.append('file', fileToUpload);
      formData.append('folder', folder);

      const response = await fetch(this.uploadEndpoint, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'CDN Upload failed');

      return {
        success: true,
        cdnUrl: result.secure_url,
        publicId: result.public_id
      };
    } catch (error) {
      console.error('[CreateWishCDN] Upload Error:', error);
      return { success: false, message: error.message };
    }
  }
}

export const createWishCDNInstance = new CreateWishCDN();
