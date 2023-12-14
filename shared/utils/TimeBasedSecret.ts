type UpdateHandler = (newValue: Uint8Array) => void;

export default class TimeBasedSecret {
    private static lastGenTime = Date.now();
    private static _value = crypto.getRandomValues(new Uint8Array(16));

    public static refreshInterval = 30000; // 30 seconds

    private static updateHandlers: UpdateHandler[] = [];

    private static _bgRefresh = false;

    private static bgRefreshTimeout: ReturnType<typeof setTimeout>;

    static init() {
        TimeBasedSecret.refresh();
    }

    static get value() {
        const now = Date.now();

        if (now - TimeBasedSecret.lastGenTime > this.refreshInterval) {
            TimeBasedSecret.refresh();
        }

        return TimeBasedSecret._value;
    }

    /**
     * Causes a refresh of secret
     */
    static refresh() {
        TimeBasedSecret._value = crypto.getRandomValues(new Uint8Array(16));
        TimeBasedSecret.lastGenTime = Date.now();

        for (const handler of TimeBasedSecret.updateHandlers) handler(TimeBasedSecret.value);

        if (TimeBasedSecret.bgRefresh) {
            TimeBasedSecret.bgRefreshTimeout = setTimeout(
                TimeBasedSecret.refresh,
                TimeBasedSecret.refreshInterval
            );
        }
    }

    static onUpdate(handler: UpdateHandler) {
        if (!TimeBasedSecret.updateHandlers.find((h) => h !== handler))
            TimeBasedSecret.updateHandlers.push(handler);
    }

    static offUpdate(handler: UpdateHandler) {
        const index = TimeBasedSecret.updateHandlers.findIndex((h) => h === handler);
        if (index > -1) TimeBasedSecret.updateHandlers.splice(index, 1);
    }

    static get bgRefresh() {
        return TimeBasedSecret._bgRefresh;
    }

    static set bgRefresh(value: boolean) {
        clearTimeout(TimeBasedSecret.bgRefreshTimeout);
        TimeBasedSecret._bgRefresh = value;
        TimeBasedSecret.refresh();
    }
}
