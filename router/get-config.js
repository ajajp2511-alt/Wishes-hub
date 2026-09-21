export default function handler(req, res) {
  // CORS & Cache Bypass
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  res.status(200).json({
    // 1. Firebase Configs
    apiKey: process.env.FIREBASE_API_KEY || null,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || null,
    projectId: process.env.FIREBASE_PROJECT_ID || null,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || null,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || null,
    appId: process.env.FIREBASE_APP_ID || null,
    adminUid: process.env.ADMIN_UID || null,

    // 2. Adsterra Ad Keys
    socialBarKey: process.env.ADSTERRA_SOCIAL_BAR_KEY || null,
    nativeKey: process.env.ADSTERRA_NATIVE_KEY || null,
    directLink: process.env.ADSTERRA_DIRECT_LINK || null,
    popunderKey: process.env.ADSTERRA_POPUNDER_KEY || null,
    banner160x600Key: process.env.ADSTERRA_BANNER_160X600_KEY || null,
    banner320x50Key: process.env.ADSTERRA_BANNER_320X50_KEY || null,
    banner728x90Key: process.env.ADSTERRA_BANNER_728X90_KEY || null,
    banner468x60Key: process.env.ADSTERRA_BANNER_468X60_KEY || null,
    banner300x250Key: process.env.ADSTERRA_BANNER_300X250_KEY || null,
    banner160x300Key: process.env.ADSTERRA_BANNER_160X300_KEY || null,
  });
}
