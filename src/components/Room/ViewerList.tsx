import React from 'react';
import styles from './styles/ViewerList.module.css';
import { Video } from './Video';

interface Props {
  viewerStreams: any[];
}

export function ViewerList({ viewerStreams }: Props) {
  const videoComponents = viewerStreams.map((stream, key) => (
    <div key={key} className={styles.videoWrapper}>
      <Video stream={stream} muted={false} />
    </div>
  ));

  return <div className={styles.container}>{videoComponents}</div>;
}
