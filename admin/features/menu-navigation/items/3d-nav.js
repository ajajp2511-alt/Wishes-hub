/**
 * Path: admin/features/menu-navigation/items/3d-nav.js
 */

import { THREE_CONFIG } from '../../3d/3d-config.js';

export const threedNavItem = {
  id: '3d-engine',
  label: '3D Engine',
  icon: '🧊',
  subItems: [
    { id: '3d-viewer', label: '3D Viewer' },
    { id: '3d-assets', label: 'Asset Manager' },
    { id: '3d-geofence', label: 'Geofence Security' },
    { id: '3d-security', label: 'Security & PIN' }
  ],
  config: THREE_CONFIG
};
