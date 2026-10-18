/**
 * 3D Live Party & Multi-User WebSocket Sync Module
 * Path: wishes-hub/admin/features/3d/modules/3d-live-party.js
 */

import { THREE_CONFIG } from '../3d-config.js';
import { coreEngine } from '../3d-core.js';

export class LiveParty {
  constructor() {
    this.moduleName = '3d-live-party';
    this.socket = null;
    this.roomId = null;
    this.pin = null;
    this.init();
  }

  init() {
    coreEngine.registerModule(this.moduleName, this);
    console.log(`[Module] ${this.moduleName} initialized.`);
  }

  // Create or join a PIN-protected live sync party room
  connectToParty(roomId, pin, serverUrl = 'wss://api.wishes-hub.com/3d-live') {
    if (!pin || pin.toString().length !== THREE_CONFIG.SECURITY.PIN_LENGTH) {
      throw new Error(`[Live Party] PIN must be exactly ${THREE_CONFIG.SECURITY.PIN_LENGTH} digits.`);
    }

    this.roomId = roomId;
    this.pin = pin;

    this.socket = new WebSocket(serverUrl);

    this.socket.onopen = () => {
      console.log(`[Live Party] Connected to live party server.`);
      this.socket.send(JSON.stringify({
        type: 'join',
        roomId: this.roomId,
        pin: this.pin,
        userId: coreEngine.state.currentUser?.id || `user_${Math.random().toString(36).substr(2, 9)}`
      }));
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handlePartyEvent(data);
    };

    this.socket.onerror = (error) => {
      console.error('[Live Party Socket Error]', error);
      coreEngine.emit('liveparty:error', { error });
    };

    this.socket.onclose = () => {
      console.log('[Live Party] Disconnected from room.');
      coreEngine.emit('liveparty:disconnected', { roomId: this.roomId });
    };
  }

  // Broadcast 3D interaction state across room participants
  broadcastInteraction(actionType, payload = {}) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'interaction',
        roomId: this.roomId,
        action: actionType,
        payload,
        timestamp: Date.now()
      }));
    }
  }

  handlePartyEvent(data) {
    switch (data.type) {
      case 'room_joined':
        coreEngine.emit('liveparty:joined', data);
        break;
      case 'user_joined':
        coreEngine.emit('liveparty:user_joined', data);
        break;
      case 'interaction_sync':
        coreEngine.emit('liveparty:sync_action', data);
        break;
      case 'pin_invalid':
        coreEngine.emit('liveparty:auth_failed', { message: 'Invalid Room PIN' });
        this.socket.close();
        break;
      default:
        break;
    }
  }
}

export default LiveParty;
