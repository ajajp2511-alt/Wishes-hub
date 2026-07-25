import { SeoCore } from './seo-core.js';

export class SeoAssembly {
  constructor() {
    this.core = new SeoCore();
  }

  init(customSeoData = {}) {
    this.core.updateSeoData(customSeoData);
  }

  updatePageSeo(seoData) {
    this.core.updateSeoData(seoData);
  }
}
