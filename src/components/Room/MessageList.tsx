import React from 'react';
import styles from './styles/MessageList.module.css';
import { Message } from './Message';

interface Props {
  messages: any[];
}

export function MessageList({ messages }: Props) {
  return (
    <div className={styles.container}>
      {messages.map((message: any, i: number) => (
        <div key={i}>
          <Message message={message} />
        </div>
      ))}
    </div>
  );
}
