import { atom } from "jotai";
import Peer, { DataConnection } from "peerjs";

export const localPeerAtom = atom<Peer | null>(null);
export const connectionsAtom = atom<DataConnection[]>([]);
