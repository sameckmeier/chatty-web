import React from 'react';
import styles from './styles/Room.module.css';
import { Chat } from './Chat';
import { VideoChat } from './VideoChat';

export function Room() {
  return (
    <div className={styles.container}>
      <div className={styles.chatWrapper}>
        <Chat />
      </div>
      <div className={styles.videoChatWrapper}>
        <VideoChat />
      </div>
    </div>
  );
}
