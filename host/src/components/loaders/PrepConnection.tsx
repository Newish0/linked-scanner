import messages from "@components/loaders/messages.json";

export default function PrepConnection() {
    return (
        <div className="m-auto text-center p-8">
            <div className="loading loading-ring loading-lg"></div>
            <div>
                {
                    messages.connectionMessages[
                        Math.floor(Math.random() * messages.connectionMessages.length)
                    ]
                }
            </div>
        </div>
    );
}
