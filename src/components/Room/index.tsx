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
import { WebSocketClient } from '../../clients/WebSocketClient';
import { Message, createMessage, validateMessage } from '../../domain/Message';
import env from '../../config/env';

interface WebRTCPeerClientDict {
  [key: string]: IWebRTCPeerClient;
}

interface State {
  messages: Message[];
}

const webRTCPeerClientDict: WebRTCPeerClientDict = {};

export function Room() {
  const [messages, setMessages] = useState<Message[]>([]);

  useMountEffect(() => {
    const socket = new WebSocket(env.apiUrl());
    const webSocketClient = new WebSocketClient(socket);

    webSocketClient.registerPeerHandler(
      ({ peerId: newPeerId, initiator }: any) => {
        const peer = new Peer({ initiator, trickle: true });
        const webRTCClient = new WebRTCPeerClient(peer);

        webRTCClient.registerConnectionHandler(() => {
          console.log(`WebRTC connection ready`);
          webRTCPeerClientDict[newPeerId] = webRTCClient;
        });

        webRTCClient.registerSignalHandler((data: any) => {
          webSocketClient.emitSignal({ peerId: newPeerId, signal: data });
        });

        webRTCClient.registerDataHandler((data: any) => {
          try {
            const message = JSON.parse(data);
            updateMessages(message);
          } catch (err) {
            console.log(err);
          }
        });

        webRTCPeerClientDict[newPeerId] = webRTCClient;
      },
    );

    webSocketClient.registerSignalHandler((data: any) => {
      const peer = webRTCPeerClientDict[data.peerId];

      if (peer) {
        console.log(
          `Received signalling data ${data} from Peer ID: ${data.peerId}`,
        );

        peer.signal(data.signal);
      }
    });

    return () => {
      const webRTCClients = Object.values(webRTCPeerClientDict);
      webRTCClients.forEach((webRTCClient: IWebRTCPeerClient) => {
        webRTCClient.cleanUp();
      });

      webSocketClient.cleanUp();
    };
  });

  const updateMessages = (message: Message) => {
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
        <VideoChat />
      </div>
    </div>
  );
}
