import React, { useState } from 'react';
import Peer from 'simple-peer';
import WebSocket from 'ws';
import styles from './styles/Room.module.css';
import { Chat } from './Chat';
import { VideoChat } from './VideoChat';
import { useMountEffect } from '../hooks';
import {
  WebRTCPeerClient,
  IWebRTCPeerClient,
  WEB_RTC_EVENTS,
} from '../../clients/WebRTCPeerClient';
import {
  WebSocketClient,
  IWebSocketClient,
  WEB_SOCKET_EVENTS,
} from '../../clients/WebSocketClient';
import { Message, createMessage, validateMessage } from '../../domain/Message';
import env from '../../config/env';

interface State {
  messages: Message[];
}

export function Room() {
  const [
    webSocketClient,
    setWebSocketClient,
  ] = useState<IWebSocketClient | null>(null);
  const [
    webRTCPeerClient,
    setWebRTCPeerClient,
  ] = useState<IWebRTCPeerClient | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useMountEffect(initConnections);

  function initConnections() {
    const socket = new WebSocket(env.host());
    const peer = new Peer({ initiator: true });
    const _webSocketClient = new WebSocketClient(socket);
    const _webRTCClient = new WebRTCPeerClient(peer, _webSocketClient);

    setWebSocketClient(_webSocketClient);
    setWebRTCPeerClient(_webRTCClient);

    _webSocketClient.connect(() => {
      _webRTCClient.registerSignalHanders();

      _webRTCClient.registerDataHandler((data: any) => {
        setMessages(data);
      });
    });

    return () => {
      _webRTCClient.cleanUp(() => {
        _webSocketClient.cleanUp();
      });
    };
  }

  async function addMessage(content: string) {
    try {
      const message = createMessage(content);

      await validateMessage(message);

      setMessages([message, ...messages]);

      if (webRTCPeerClient) {
        webRTCPeerClient.emit(message);
      }
    } catch (err) {
      console.log(err);
    }
  }

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
