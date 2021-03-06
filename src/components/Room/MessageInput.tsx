import React, { useState } from 'react';
import styles from './styles/MessageInput.module.css';

interface Props {
  addMessage: (content: string) => void;
}

export function MessageInput({ addMessage }: Props) {
  const [content, setContent] = useState('');

  const onClick = () => {
    addMessage(content);
    setContent('');
  };

  const onChange = ({ target: { value } }: any) => {
    setContent(value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputWrapper}>
        <textarea
          className={styles.messageInput}
          onChange={onChange}
          value={content}
        />
        <button className={styles.sendMessage} onClick={onClick}>
          Send
        </button>
      </div>
    </div>
  );
}
