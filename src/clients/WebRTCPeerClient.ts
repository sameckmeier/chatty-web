import { IWebSocketClient, WEB_SOCKET_EVENTS } from './WebSocketClient';

export enum WEB_RTC_EVENTS {
  CLOSE = 'close',
  DATA = 'data',
}

export interface IWebRTCPeerClient {
  emit(payload: any): void;
  registerSignalHanders(): void;
  registerDataHandler(json: string): void;
  registerHandler(type: string, fn: any): void;
  cleanUp(fn?: any): void;
}

export class WebRTCPeerClient implements IWebRTCPeerClient {
  constructor(private peer: any, private webSocketClient: IWebSocketClient) {}

  emit(payload: any) {
    this.peer.send(JSON.stringify(payload));
  }

  registerSignalHanders() {
    this.registerHandler(WEB_SOCKET_EVENTS.SIGNAL, (data: any) => {
      this.webSocketClient.emit(WEB_SOCKET_EVENTS.SIGNAL, data);
    });
  }

  registerDataHandler(fn: any) {
    this.peer.on(WEB_RTC_EVENTS.DATA, (json: string) => {
      const payload = JSON.parse(json);
      fn(payload);
    });
  }

  registerHandler(type: string, fn: any) {
    this.peer.on(type, () => {
      fn();
    });
  }

  cleanUp(fn?: any) {
    if (fn) {
      this.registerHandler(WEB_RTC_EVENTS.CLOSE, fn);
    }

    this.peer.destroy();
  }
}
