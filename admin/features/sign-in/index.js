/**
 * Admin Sign-In Module - Barrel Export File
 * Central entry point importing all internal sub-modules and exposing the assembled feature interface.
 */

import { SIGN_IN_CONFIG, SIGN_IN_ERRORS } from './sign-in-config.js';
import { signInCore } from './sign-in-core.js';
import { SignInFormCapture } from './modules/sign-in-form-capture.js';
import { SignInWhitelist } from './modules/sign-in-whitelist.js';
import { SignInCredentials } from './modules/sign-in-credentials.js';
import { SignInToken } from './modules/sign-in-token.js';
import { SignInMfa } from './modules/sign-in-mfa.js';
import { SignInPasskey } from './modules/sign-in-passkey.js';
import { SignInIpGuard } from './modules/sign-in-ip-guard.js';
import { SignInGeofence } from './modules/sign-in-geofence.js';
import { SignInLockout } from './modules/sign-in-lockout.js';
import { SignInAntiTamper } from './modules/sign-in-anti-tamper.js';
import { SignInWebhook } from './modules/sign-in-webhook.js';
import { SignInRescue } from './modules/sign-in-rescue.js';
import { SignInAssembly } from './sign-in-assembly.js';

export {
    SIGN_IN_CONFIG,
    SIGN_IN_ERRORS,
    signInCore,
    SignInFormCapture,
    SignInWhitelist,
    SignInCredentials,
    SignInToken,
    SignInMfa,
    SignInPasskey,
    SignInIpGuard,
    SignInGeofence,
    SignInLockout,
    SignInAntiTamper,
    SignInWebhook,
    SignInRescue,
    SignInAssembly
};
