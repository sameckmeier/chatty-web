import { IWebRTCPeerManager } from '../web-rtc/WebRTCPeerManager';

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
  registerPeerHandler(stream: any, webRTCPeerManager: IWebRTCPeerManager): void;
  registerSignalHandler(webRTCPeerManager: IWebRTCPeerManager): void;
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

  registerPeerHandler(stream: any, webRTCPeerManager: IWebRTCPeerManager) {
    this.registerMessageHandler(
      WEB_SOCKET_EVENTS.PEER,
      ({ peerId, initiator }: any) => {
        webRTCPeerManager.add({ id: peerId, initiator, stream, trickle: true });
      },
    );
  }

  registerSignalHandler(webRTCPeerManager: IWebRTCPeerManager) {
    this.registerMessageHandler(WEB_SOCKET_EVENTS.SIGNAL, (data: any) => {
      const peer = webRTCPeerManager.get(data.peerId);

      if (peer) {
        console.log(
          `Received signalling data ${data} from Peer ID: ${data.peerId}`,
        );

        peer.signal(data.signal);
      }
    });
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
