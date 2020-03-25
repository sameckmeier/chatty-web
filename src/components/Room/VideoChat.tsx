import React from 'react';
import styles from './styles/VideoChat.module.css';
import { Video } from './Video';
import { ViewerList } from './ViewerList';

interface Props {
  presenterStream: any;
  viewerStreams: any[];
}

export function VideoChat({ presenterStream, viewerStreams }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.presenterWrapper}>
        <Video stream={presenterStream} muted={true} />
      </div>
      <div className={styles.overlay}>
        <div className={styles.viewerListWrapper}>
          <ViewerList viewerStreams={viewerStreams} />
        </div>
      </div>
    </div>
  );
}
