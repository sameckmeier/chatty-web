import { IWebSocketClient } from '../socket/WebSocketClient';
import { IWebRTCPeerManager } from '../web-rtc/WebRTCPeerManager';

class BrowserMediaManager {
  public getMedia(
    webSocketClient: IWebSocketClient,
    webRTCPeerManager: IWebRTCPeerManager,
  ) {
    navigator.getUserMedia(
      { video: true, audio: true },
      stream => {
        webSocketClient.registerPeerHandler(stream, webRTCPeerManager);
        webSocketClient.registerSignalHandler(webRTCPeerManager);
      },
      () => {},
    );
  }
}

export default new BrowserMediaManager();
