import React, { useRef } from 'react';
import styles from './styles/Video.module.css';

interface Props {
  stream: MediaStream | null;
  muted: boolean;
}

export function Video({ stream, muted }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className={styles.container}>
      <video
        ref={video => {
          if (video && stream) {
            video.srcObject = stream;
            video.play();
          }
        }}
        className={styles.video}
        muted={muted}
      />
    </div>
  );
}
