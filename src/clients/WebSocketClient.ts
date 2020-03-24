export enum WEB_SOCKET_CHANNELS {
  MESSAGE = 'message',
  OPEN = 'open',
}

export enum WEB_SOCKET_EVENTS {
  SIGNAL = 'signal',
  PEER = 'peer',
  CONNECTED = 'connected',
}

export interface IWebSocketClient {
  registerConnectionHandler(fn: any): void;
  registerPeerHandler(fn: any): void;
  registerSignalHandler(fn: any): void;
  emitSignal(data: any): void;
  cleanUp(fn?: any): void;
}

export class WebSocketClient implements IWebSocketClient {
  private messageHandlers: any[];

  constructor(private socket: WebSocket) {
    this.messageHandlers = [];

    this.socket.onmessage = (event: any) => {
      this.messageHandlers.forEach(handler => {
        handler(event.data);
      });
    };
  }

  registerConnectionHandler(fn: any) {
    this.registerMessageHandler(WEB_SOCKET_EVENTS.CONNECTED, fn);
  }

  registerPeerHandler(fn: any) {
    this.registerMessageHandler(WEB_SOCKET_EVENTS.PEER, fn);
  }

  registerSignalHandler(fn: any) {
    this.registerMessageHandler(WEB_SOCKET_EVENTS.SIGNAL, fn);
  }

  emitSignal(data: any) {
    const json = JSON.stringify({ type: WEB_SOCKET_EVENTS.SIGNAL, ...data });
    this.socket.send(json);
  }

  cleanUp() {
    this.socket.close();
  }

  private registerMessageHandler(event: string, fn: any) {
    this.messageHandlers.push((json: string) => {
      const data = JSON.parse(json);

      if (data.type === event) {
        fn(data);
      }
    });
  }
}
