/**
 * modules/manage-loading-spinner.js
 * Multi-style dynamic visual renderer for all animation types
 */
export const LoadingSpinner = {
  render(type) {
    const overlay = document.getElementById('wishes-loading-overlay');
    if (!overlay) return;

    const container = document.createElement('div');
    container.id = 'wishes-spinner-container';
    container.className = `loading-anim-${type}`;

    switch (type) {
      case 'spinner':
        container.innerHTML = `<div class="wh-spinner-ring"></div>`;
        break;
      case 'pulse':
        container.innerHTML = `<div class="wh-pulse-dots"><span></span><span></span><span></span></div>`;
        break;
      case 'progress':
        container.innerHTML = `<div class="wh-progress-bar"><div class="wh-progress-shimmer"></div></div>`;
        break;
      case 'skeleton':
        container.innerHTML = `<div class="wh-skeleton-box"></div>`;
        break;
      case 'ripple':
        container.innerHTML = `<div class="wh-ripple-wave"></div>`;
        break;
      case 'cube':
        container.innerHTML = `<div class="wh-cube-flip"></div>`;
        break;
      case 'infinity':
        container.innerHTML = `<div class="wh-infinity-loop"></div>`;
        break;
      default:
        container.innerHTML = `<div class="wh-spinner-ring"></div>`;
    }

    overlay.insertBefore(container, overlay.firstChild);
  },

  remove() {
    const container = document.getElementById('wishes-spinner-container');
    if (container) container.remove();
  }
};
