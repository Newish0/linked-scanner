export enum HistoryType {
    Connect,
    Disconnect,
    Scan,
}

export default interface ScanHistory {
    id?: number;
    deviceId: string;
    createdAt: Date;
    content: any;
    type: HistoryType;
}
