import { IWebRTCPeer } from './WebRTCPeer';
import {
  IWebRTCPeerFactory,
  CreateWebRTCPeerParams,
} from './WebRTCPeerFactory';

export interface IWebRTCPeerManager {
  add(args: CreateWebRTCPeerParams): void;
  get(id: string): IWebRTCPeer;
}

export class WebRTCPeerManager {
  private peerDict: { [key: string]: IWebRTCPeer };
  private streamDict: { [key: string]: MediaStream };
  private webRTCPeerFactory: IWebRTCPeerFactory;
  private onData: (json: string) => void;
  private onStream: (stream: any) => void;
  private onSignal: (data: any, peer: IWebRTCPeer) => void;
  private onDisconnect: (stream: MediaStream) => void;

  constructor(args: {
    webRTCPeerFactory: IWebRTCPeerFactory;
    onData: (json: string) => void;
    onStream: (stream: any) => void;
    onSignal: (data: any, peer: IWebRTCPeer) => void;
    onDisconnect: (stream: MediaStream) => void;
  }) {
    this.peerDict = {};
    this.streamDict = {};
    this.webRTCPeerFactory = args.webRTCPeerFactory;
    this.onData = args.onData;
    this.onStream = args.onStream;
    this.onSignal = args.onSignal;
    this.onDisconnect = args.onDisconnect;
  }

  public add(args: CreateWebRTCPeerParams) {
    const webRTCPeer = this.webRTCPeerFactory.create(args);
    this.peerDict[webRTCPeer.id] = webRTCPeer;

    webRTCPeer.registerConnectionHandler(() => {
      this.onConnection(webRTCPeer);
    });

    webRTCPeer.registerDisconnectHandler(() => {
      this._onDisconnect(webRTCPeer);
    });

    webRTCPeer.registerSignalHandler((data: any) => {
      this._onSignal(data, webRTCPeer);
    });

    webRTCPeer.registerDataHandler((json: string) => {
      this._onData(json);
    });

    webRTCPeer.registerStreamHandler((stream: any) => {
      this._onStream(webRTCPeer, stream);
    });

    webRTCPeer.registerErrorHandler((err: Error) => {
      this.onError(webRTCPeer, err);
    });
  }

  public get(id: string): IWebRTCPeer {
    return this.peerDict[id];
  }

  private onConnection(peer: IWebRTCPeer) {
    try {
      console.log(`WebRTC connection ready with ${peer.id}`);
    } catch (err) {
      console.log(err);
    }
  }

  private _onData(json: string) {
    try {
      const data = JSON.parse(json);
      this.onData(data);
    } catch (err) {
      console.log(err);
    }
  }

  private _onSignal(data: any, peer: IWebRTCPeer) {
    try {
      this.onSignal(data, peer);
    } catch (err) {
      console.log(err);
    }
  }

  private _onStream(peer: IWebRTCPeer, stream: MediaStream) {
    try {
      console.log(`Received stream from ${peer.id}`);
      this.streamDict[peer.id] = stream;
      this.onStream(stream);
    } catch (err) {
      console.log(err);
    }
  }

  private _onDisconnect(peer: IWebRTCPeer) {
    try {
      console.log(`Disconnecting with ${peer.id}`);

      if (this.onDisconnect) {
        const stream = this.streamDict[peer.id];
        this.onDisconnect(stream);
      }

      this.peerDict[peer.id].cleanUp();
      delete this.peerDict[peer.id];
    } catch (err) {
      console.log(err);
    }
  }

  private onError(peer: IWebRTCPeer, err: Error) {
    console.log(`Received error from ${peer.id}`);
    console.log(err);
  }
}
