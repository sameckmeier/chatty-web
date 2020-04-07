class BrowserMediaManager {
  getMedia(fn: (stream: MediaStream) => void) {
    navigator.getUserMedia({ video: true, audio: true }, fn, () => {});
  }
}

export default new BrowserMediaManager();
