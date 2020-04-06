import Peer from 'simple-peer';
import { WebRTCPeer, IWebRTCPeer } from '../../infra/web-rtc/WebRTCPeer';

export interface CreateWebRTCPeerParams {
  initiator: boolean;
  stream: MediaStream;
  trickle: boolean;
  id: string;
}

export interface IWebRTCPeerFactory {
  create(args: CreateWebRTCPeerParams): IWebRTCPeer;
}

export class WebRTCPeerFactory implements IWebRTCPeerFactory {
  public create(args: CreateWebRTCPeerParams): IWebRTCPeer {
    const { id, ...peerArgs } = args;
    const peer = new Peer(peerArgs);
    return new WebRTCPeer(id, peer);
  }
}
