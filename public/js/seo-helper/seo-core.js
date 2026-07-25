import { SEO_CONFIG } from './seo-config.js';

export class SeoCore {
  setMetaTag(attrName, attrVal, content) {
    let element = document.querySelector(`meta[${attrName}="${attrVal}"]`);
    
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attrName, attrVal);
      document.head.appendChild(element);
    }
    
    element.setAttribute('content', content);
  }

  setCanonicalUrl(url) {
    let link = document.querySelector("link[rel='canonical']");
    
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    
    link.setAttribute('href', url);
  }

  updateSeoData({ title, description, image, url }) {
    const finalTitle = title ? `${title} | ${SEO_CONFIG.DEFAULT_META.SITE_NAME}` : SEO_CONFIG.DEFAULT_META.DEFAULT_TITLE;
    const finalDesc = description || SEO_CONFIG.DEFAULT_META.DEFAULT_DESC;
    const finalImage = image || SEO_CONFIG.DEFAULT_META.DEFAULT_IMAGE;
    const finalUrl = url || window.location.href;

    // 1. Basic Meta
    document.title = finalTitle;
    this.setMetaTag('name', 'description', finalDesc);

    // 2. Open Graph (Facebook / WhatsApp Preview)
    this.setMetaTag('property', 'og:title', finalTitle);
    this.setMetaTag('property', 'og:description', finalDesc);
    this.setMetaTag('property', 'og:image', finalImage);
    this.setMetaTag('property', 'og:url', finalUrl);
    this.setMetaTag('property', 'og:type', 'website');

    // 3. Twitter Cards
    this.setMetaTag('name', 'twitter:card', 'summary_large_image');
    this.setMetaTag('name', 'twitter:title', finalTitle);
    this.setMetaTag('name', 'twitter:description', finalDesc);
    this.setMetaTag('name', 'twitter:image', finalImage);

    // 4. Canonical Link
    this.setCanonicalUrl(finalUrl);
  }
}
