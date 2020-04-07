import React, { useState } from 'react';
import styles from './styles/Room.module.css';
import { Chat } from './Chat';
import { VideoChat } from './VideoChat';
import { useMountEffect } from '../hooks';
import { IWebRTCPeer } from '../../infra/web-rtc/WebRTCPeer';
import {
  WebSocketClient,
  IWebSocketClient,
} from '../../infra/socket/WebSocketClient';
import { Message, createMessage, validateMessage } from '../../domain/Message';
import env from '../../config/env';
import BrowserMediaManager from '../../infra/browser/BrowserMediaManager';
import {
  WebRTCPeerManager,
  IWebRTCPeerManager,
} from '../../infra/web-rtc/WebRTCPeerManager';
import { WebRTCPeerFactory } from '../../infra/web-rtc/WebRTCPeerFactory';

let webSocketClient: IWebSocketClient;
let webRTCPeerManager: IWebRTCPeerManager;

export function Room() {
  const [presenterStream, setPresenterStream] = useState<MediaStream | null>(
    null,
  );
  const [viewerStreams, setViewerStreams] = useState<MediaStream[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  useMountEffect(() => {
    const socket = new WebSocket(env.apiUrl());
    webSocketClient = new WebSocketClient(socket);

    const webRTCPeerFactory = new WebRTCPeerFactory();
    webRTCPeerManager = new WebRTCPeerManager({
      webRTCPeerFactory,
      onData: updateMessages,
      onStream: (stream: MediaStream): void => {
        setViewerStreams((prevViewerStreams: MediaStream[]) => [
          ...prevViewerStreams,
          stream,
        ]);
      },
      onSignal: (data: any, peer: IWebRTCPeer): void => {
        try {
          webSocketClient.emitSignal({ peerId: peer.id, signal: data });
        } catch (err) {
          console.log(err);
        }
      },
      onDisconnect: (stream: MediaStream): void => {
        setViewerStreams((prevViewerStreams: MediaStream[]) =>
          prevViewerStreams.filter(s => s.id !== stream.id),
        );
      },
    });

    BrowserMediaManager.getMedia((stream: MediaStream) => {
      webSocketClient.registerPeerHandler(stream, webRTCPeerManager);
      webSocketClient.registerSignalHandler(webRTCPeerManager);
      setPresenterStream(stream);
    });

    return () => {
      webRTCPeerManager.cleanUp();
      webSocketClient.cleanUp();
    };
  });

  const updateMessages = (message: Message): void => {
    try {
      setMessages((prevMessages: Message[]) => [...prevMessages, message]);
    } catch (err) {
      console.log(err);
    }
  };

  const addMessage = async (content: string): Promise<void> => {
    try {
      const message = createMessage(content);

      await validateMessage(message);

      updateMessages(message);

      webRTCPeerManager.emit(message);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.chatWrapper}>
        <Chat messages={messages} addMessage={addMessage} />
      </div>
      <div className={styles.videoChatWrapper}>
        <VideoChat
          presenterStream={presenterStream}
          viewerStreams={viewerStreams}
        />
      </div>
    </div>
  );
}
