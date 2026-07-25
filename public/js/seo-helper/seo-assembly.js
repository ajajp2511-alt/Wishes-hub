import { SeoCore } from './seo-core.js';

export class SeoAssembly {
  constructor() {
    this.core = new SeoCore();
  }

  init(initialMetaData = {}) {
    this.core.updateSeoData(initialMetaData);
  }

  setDynamicSeo(title, description, image, url) {
    this.core.updateSeoData({ title, description, image, url });
  }
}
