export enum WEB_SOCKET_EVENTS {
  SIGNAL = 'signal',
  CONNECT = 'open',
  DISCONNECT = 'disconnect',
}

export interface IWebSocketClient {
  emit(EVENTS: string, payload: any): void;
  registerHandler(type: string, fn: any): void;
  connect(fn: any): void;
  cleanUp(fn?: any): void;
}

export class WebSocketClient implements IWebSocketClient {
  constructor(private socket: any) {}

  emit(EVENTS: string, payload: any) {
    this.socket.emit(EVENTS, JSON.stringify(payload));
  }

  registerHandler(type: string, fn: any) {
    this.socket.on(type, fn);
  }

  connect(fn: any) {
    this.registerHandler(WEB_SOCKET_EVENTS.CONNECT, fn);
  }

  cleanUp(fn?: any) {
    if (fn) {
      this.registerHandler(WEB_SOCKET_EVENTS.DISCONNECT, fn);
    }

    this.socket.disconnect();
  }
}
