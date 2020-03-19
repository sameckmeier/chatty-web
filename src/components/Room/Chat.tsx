import React, { useState } from 'react';
import styles from './styles/Chat.module.css';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

let DATA: any = [...Array(40)].map(_ => ({ content: 'Ipsum Lorem' }));
DATA = [
  {
    content:
      'Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem',
  },
  ...DATA,
];

export function Chat() {
  const [messages, setMessages] = useState(DATA);

  const createMessage = (content: string) => {
    setMessages([{ content }, ...messages]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.messageListWrapper}>
        <MessageList messages={messages} />
      </div>
      <div className={styles.messageInputWrapper}>
        <MessageInput createMessage={createMessage} />
      </div>
    </div>
  );
}
