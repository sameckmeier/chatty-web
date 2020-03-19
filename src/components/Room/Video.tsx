import React from 'react';
import styles from './styles/Video.module.css';

interface Props {
  connection: any;
}

export function Video({ connection }: Props) {
  return <div className={styles.container}></div>;
}
