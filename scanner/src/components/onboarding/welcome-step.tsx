export function WelcomeStep(props: { onNext: () => void }) {
    return (
        <div class="card card-border bg-base-100">
            <div class="card-body items-center gap-3 text-center">
                <img
                    src="/logoR192.png"
                    alt="Linked Scanner"
                    class="size-24"
                />
                <h2 class="card-title text-xl">Welcome to Linked Scanner</h2>
                <p class="text-base font-medium text-base-content/80">
                    Your phone, now a barcode scanner for your PC.
                </p>
                <p class="text-sm text-base-content/60">
                    Point your phone at QR codes and barcodes on your computer
                    screen — no cables needed.
                </p>
                <button class="btn btn-primary btn-block mt-2" onClick={props.onNext}>
                    Continue
                </button>
            </div>
        </div>
    );
}

export default WelcomeStep;
