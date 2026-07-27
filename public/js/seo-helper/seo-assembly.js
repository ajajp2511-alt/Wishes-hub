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

// 🔽 Yeh wrapper function file ke end me add kar dijiye
export function initSeoHelper(initialMetaData = {}) {
  const assembly = new SeoAssembly();
  assembly.init(initialMetaData);
  return assembly;
}
