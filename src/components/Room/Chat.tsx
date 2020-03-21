import React from 'react';
import styles from './styles/Chat.module.css';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Message } from '../../domain/Message';

interface Props {
  messages: Message[];
  addMessage(content: string): void;
}

export function Chat({ messages, addMessage }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.messageListWrapper}>
        <MessageList messages={messages} />
      </div>
      <div className={styles.messageInputWrapper}>
        <MessageInput addMessage={addMessage} />
      </div>
    </div>
  );
}
