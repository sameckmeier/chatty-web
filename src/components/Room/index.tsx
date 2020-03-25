import React, { useState } from 'react';
import Peer from 'simple-peer';
import styles from './styles/Room.module.css';
import { Chat } from './Chat';
import { VideoChat } from './VideoChat';
import { useMountEffect } from '../hooks';
import {
  WebRTCPeerClient,
  IWebRTCPeerClient,
} from '../../clients/WebRTCPeerClient';
import {
  WebSocketClient,
  IWebSocketClient,
} from '../../clients/WebSocketClient';
import { Message, createMessage, validateMessage } from '../../domain/Message';
import env from '../../config/env';

interface WebRTCPeerClientDict {
  [key: string]: IWebRTCPeerClient;
}

interface webRTCPeerStreamDict {
  [key: string]: MediaStream;
}

const webRTCPeerClientDict: WebRTCPeerClientDict = {};
const webRTCPeerStreamDict: webRTCPeerStreamDict = {};

export function Room() {
  const [presenterStream, setPresenterStream] = useState<MediaStream | null>(
    null,
  );
  const [viewerStreams, setViewerStreams] = useState<MediaStream[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [
    webSocketClient,
    setWebSocketClient,
  ] = useState<IWebSocketClient | null>(null);

  useMountEffect(() => {
    navigator.getUserMedia(
      { video: true, audio: true },
      stream => {
        const socket = new WebSocket(env.apiUrl());
        const webSocketClient = new WebSocketClient(socket);
        setWebSocketClient(webSocketClient);
        setPresenterStream(stream);
        addPeer(webSocketClient, stream);
      },
      () => {},
    );

    return () => {
      const webRTCClients = Object.values(webRTCPeerClientDict);
      webRTCClients.forEach((webRTCClient: IWebRTCPeerClient) => {
        webRTCClient.cleanUp();
      });

      webSocketClient && webSocketClient.cleanUp();
    };
  });

  const addPeer = (
    webSocketClient: IWebSocketClient,
    stream: MediaStream,
  ): void => {
    webSocketClient.registerPeerHandler(
      ({ peerId: newPeerId, initiator }: any) => {
        const peer = new Peer({ initiator, stream, trickle: true });
        const webRTCClient = new WebRTCPeerClient(peer);
        webRTCPeerClientDict[newPeerId] = webRTCClient;

        webRTCClient.registerConnectionHandler(() => {
          try {
            console.log(`WebRTC connection ready with ${newPeerId}`);
          } catch (err) {
            console.log(err);
          }
        });

        webRTCClient.registerDisconnectHandler(() => {
          try {
            console.log(`Disconnecting with ${newPeerId}`);

            const stream = webRTCPeerStreamDict[newPeerId];

            setViewerStreams((prevViewerStreams: MediaStream[]) =>
              prevViewerStreams.filter(s => s.id !== stream.id),
            );

            webRTCPeerClientDict[newPeerId].cleanUp();
            delete webRTCPeerClientDict.newPeerId;
          } catch (err) {
            console.log(err);
          }
        });

        webRTCClient.registerSignalHandler((data: any) => {
          try {
            webSocketClient.emitSignal({ peerId: newPeerId, signal: data });
          } catch (err) {
            console.log(err);
          }
        });

        webRTCClient.registerDataHandler((data: any) => {
          try {
            const message = JSON.parse(data);
            updateMessages(message);
          } catch (err) {
            console.log(err);
          }
        });

        webRTCClient.registerStreamHandler((stream: any) => {
          try {
            console.log(`Received stream from ${newPeerId}`);
            webRTCPeerStreamDict[newPeerId] = stream;
            setViewerStreams((prevViewerStreams: MediaStream[]) => [
              ...prevViewerStreams,
              stream,
            ]);
          } catch (err) {
            console.log(err);
          }
        });

        webRTCClient.registerErrorHandler((err: Error) => {
          console.log(`Received error from ${newPeerId}`);
          console.log(err);
        });
      },
    );

    webSocketClient.registerSignalHandler((data: any): void => {
      const peer = webRTCPeerClientDict[data.peerId];

      if (peer) {
        console.log(
          `Received signalling data ${data} from Peer ID: ${data.peerId}`,
        );

        peer.signal(data.signal);
      }
    });
  };

  const updateMessages = (message: Message): void => {
    setMessages((prevMessages: Message[]) => [...prevMessages, message]);
  };

  const addMessage = async (content: string) => {
    try {
      const message = createMessage(content);

      await validateMessage(message);

      updateMessages(message);

      Object.values(webRTCPeerClientDict).forEach(peer => peer.emit(message));
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
