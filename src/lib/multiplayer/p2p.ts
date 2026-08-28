export type SignalKind = "offer" | "answer" | "ice";

export interface PeerRow {
  id: string;
  name: string;
}

export interface SignalRow {
  id: number;
  from: string;
  kind: SignalKind;
  payload: unknown;
}

export interface RtcPollResponse {
  peers: PeerRow[];
  signals: SignalRow[];
}

export interface PeerInfo {
  id: string;
  name: string;
  connectionState: RTCPeerConnectionState;
  candidateType: string | null;
  rttMs: number | null;
}

export interface P2PRoomOptions {
  room: string;
  selfId: string;
  name?: string;
  iceServers?: RTCIceServer[];
  onPeersChanged?: (peers: PeerInfo[]) => void;
  onMessage?: (from: string, data: unknown, channel: "state" | "reliable") => void;
  onConnected?: () => void;
}

export const defaultIceServers: RTCIceServer[] = [];

export class P2PRoom {
  constructor(_opts: P2PRoomOptions) {}
  close() {}
}
