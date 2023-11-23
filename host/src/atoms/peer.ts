import { atom } from "jotai";
import Peer, { DataConnection } from "peerjs";

export const selfPeerAtom = atom<Peer | null>(null);
export const connectionsAtom = atom<DataConnection[]>([]);
