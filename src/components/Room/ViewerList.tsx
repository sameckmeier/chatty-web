import React from 'react';
import styles from './styles/ViewerList.module.css';
import { Video } from './Video';

interface Props {
  viewerConnections: any[];
}

export function ViewerList({ viewerConnections }: Props) {
  const videoComponents = viewerConnections.map((connection, key) => (
    <div key={key} className={styles.videoWrapper}>
      <Video connection={connection} />
    </div>
  ));

  return <div className={styles.container}>{videoComponents}</div>;
}
