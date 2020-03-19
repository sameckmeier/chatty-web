import React from 'react';
import styles from './styles/Message.module.css';

interface Props {
  message: any;
}

export function Message({ message }: Props) {
  return <div className={styles.container}>{message.content}</div>;
}
