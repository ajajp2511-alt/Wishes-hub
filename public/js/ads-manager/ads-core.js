export class AdsCore {
  static async init() {
    try {
      const res = await fetch('/api/get-config');
      const config = await res.json();

      const loadIframeBanner = (key, width, height, containerId) => {
        if (!key) return;
        const container = document.getElementById(containerId);
        if (!container) return;

        const scriptConfig = document.createElement('script');
        scriptConfig.type = 'text/javascript';
        scriptConfig.text = `
          atOptions = {
            'key' : '${key}',
            'format' : 'iframe',
            'height' : ${height},
            'width' : ${width},
            'params' : {}
          };
        `;
        container.appendChild(scriptConfig);

        const scriptInvoke = document.createElement('script');
        scriptInvoke.type = 'text/javascript';
        scriptInvoke.src = `//www.highperformanceformat.com/${key}/invoke.js`;
        container.appendChild(scriptInvoke);
      };

      // 1. Social Bar
      if (config.socialBarKey) {
        const script = document.createElement('script');
        script.src = `//pl29359665.effectivecpmnetwork.com/ae/c0/6a/${config.socialBarKey}.js`;
        document.body.appendChild(script);
      }

      // 2. Popunder
      if (config.popunderKey) {
        const script = document.createElement('script');
        script.src = `//pl29359668.effectivecpmnetwork.com/e9/a4/84/${config.popunderKey}.js`;
        document.body.appendChild(script);
      }

      // 3. Native Banner
      if (config.nativeKey) {
        const container = document.getElementById(`container-${config.nativeKey}`);
        if (container) {
          const script = document.createElement('script');
          script.async = true;
          script.setAttribute('data-cfasync', 'false');
          script.src = `//pl29359666.effectivecpmnetwork.com/${config.nativeKey}/invoke.js`;
          container.appendChild(script);
        }
      }

      // 4. Banners
      loadIframeBanner(config.banner160x600Key, 160, 600, 'ad-banner-160x600');
      loadIframeBanner(config.banner320x50Key, 320, 50, 'ad-banner-320x50');
      loadIframeBanner(config.banner728x90Key, 728, 90, 'ad-banner-728x90');
      loadIframeBanner(config.banner468x60Key, 468, 60, 'ad-banner-468x60');
      loadIframeBanner(config.banner300x250Key, 300, 250, 'ad-banner-300x250');
      loadIframeBanner(config.banner160x300Key, 160, 300, 'ad-banner-160x300');

    } catch (err) {
      console.error("AdsCore Error:", err);
    }
  }
}

// Auto-run on load
document.addEventListener("DOMContentLoaded", () => AdsCore.init());
