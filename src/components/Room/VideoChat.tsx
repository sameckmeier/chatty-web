import React, { useState } from 'react';
import styles from './styles/VideoChat.module.css';
import { Video } from './Video';
import { ViewerList } from './ViewerList';

const viewerConnections: any = [...Array(8)].map(_ => ({}));
const presenterConnection: any = {};

export function VideoChat() {
  return (
    <div className={styles.container}>
      <div className={styles.presenterWrapper}>
        <Video connection={presenterConnection} />
      </div>
      <div className={styles.overlay}>
        <div className={styles.viewerListWrapper}>
          <ViewerList viewerConnections={viewerConnections} />
        </div>
      </div>
    </div>
  );
}
