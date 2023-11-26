import { useGlobalPeer } from "@hooks/useGlobalPeer";
import { PeerId } from "@shared/type/general";
import { invoke } from "@tauri-apps/api/tauri";
import { useState } from "react";

interface PeerData {
    payload: string;
    auth: unknown;
}

function App() {
    const [msgs, setMsgs] = useState<PeerData[]>([]);
    const { connect } = useGlobalPeer({
        handleData: (data) => {
            setMsgs([...msgs, data as PeerData]);
            console.log(data);
        },
        verbose: true,
    });

    const [id, setId] = useState("");

    return (
        <>
            <div className="text-2xl italic">Hello world</div>

            <input className="w-full" type="text" value={id} onChange={(evt) => setId(evt.target.value)} />

            <button
                onClick={() => {
                    connect(id as PeerId);
                }}
            >CONNECT </button>

            {msgs.map(({ payload }, i) => (
                <p key={i}>{payload}</p>
            ))}
        </>
    );
}

export default App;
