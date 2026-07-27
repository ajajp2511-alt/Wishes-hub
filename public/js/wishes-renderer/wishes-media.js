/* Wishes Media Processor */
import { WishesConfig } from './wishes-config.js';

export function generateMediaHtml(wish) {
    let finalMediaUrl = wish.imageUrl || null;

    if (!finalMediaUrl && wish.telegramFileId) {
        finalMediaUrl = `/api/get-media?fileId=${wish.telegramFileId}&type=${wish.fileType || 'photo'}`;
    }

    if (!finalMediaUrl) return '';

    const isGifVideo = wish.fileType === 'video' || wish.fileType === 'animation' || finalMediaUrl.includes('.mp4') || finalMediaUrl.includes('.gif');

    if (isGifVideo) {
        return `
            <div style="width:100%; border-radius:8px; overflow:hidden; background:#000; margin-bottom: 10px;">
                <video src="${finalMediaUrl}" loop muted autoplay playsinline style="width:100%; max-height:250px; display:block; object-fit:cover;"></video>
            </div>`;
    }

    let proxyCleanUrl = finalMediaUrl;
    if (finalMediaUrl.includes('api.telegram.org/file/bot')) {
        const rawTokenPath = finalMediaUrl.split('bot')[1];
        proxyCleanUrl = `${WishesConfig.mediaProxyBase}${rawTokenPath}`;
    }

    return `
        <div style="width:100%; border-radius:8px; overflow:hidden; margin-bottom: 10px;">
            <img src="${proxyCleanUrl}" alt="Wish Media" loading="lazy" onerror="this.parentElement.style.display='none';" style="width:100%; max-height:250px; object-fit:contain; display:block; border-radius:8px;">
        </div>`;
}
