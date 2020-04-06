import Peer from 'simple-peer';

export enum WEB_RTC_EVENTS {
  CLOSE = 'close',
  DATA = 'data',
  SIGNAL = 'signal',
  CONNECT = 'connect',
  ERROR = 'error',
  STREAM = 'stream',
}

export interface IWebRTCPeer {
  id: string;
  signal(data: any): void;
  emit(payload: any): void;
  registerConnectionHandler(fn: any): void;
  registerErrorHandler(fn: any): void;
  registerDataHandler(fn: any): void;
  registerSignalHandler(fn: any): void;
  registerStreamHandler(fn: any): void;
  registerDisconnectHandler(fn: any): void;
  cleanUp(fn?: any): void;
}

export class WebRTCPeer implements IWebRTCPeer {
  public id: string;
  private peer: Peer.Instance;

  constructor(id: string, peer: Peer.Instance) {
    this.id = id;
    this.peer = peer;
  }

  signal(data: any) {
    this.peer.signal(data);
  }

  emit(payload: any) {
    this.peer.send(JSON.stringify(payload));
  }

  registerConnectionHandler(fn: any) {
    this.registerHandler(WEB_RTC_EVENTS.CONNECT, fn);
  }

  registerStreamHandler(fn: any) {
    this.registerHandler(WEB_RTC_EVENTS.STREAM, fn);
  }

  registerErrorHandler(fn: any) {
    this.registerHandler(WEB_RTC_EVENTS.ERROR, fn);
  }

  registerDataHandler(fn: any) {
    this.registerHandler(WEB_RTC_EVENTS.DATA, fn);
  }

  registerSignalHandler(fn: any) {
    this.registerHandler(WEB_RTC_EVENTS.SIGNAL, fn);
  }

  registerDisconnectHandler(fn: any) {
    this.registerHandler(WEB_RTC_EVENTS.CLOSE, fn);
  }

  cleanUp() {
    this.peer.destroy();
  }

  private registerHandler(type: string, fn: any) {
    this.peer.on(type, fn);
  }
}
