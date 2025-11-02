type TimerCallback = () => void;

export class PauseableTimeout {
    private timerId: ReturnType<typeof setTimeout> | null = null;
    private startTime: number = 0;
    private remainingTime: number = 0;
    private isPaused: boolean = false;
    private readonly callback: TimerCallback;
    private readonly delay: number;

    constructor(callback: TimerCallback, delay: number) {
        if (delay < 0) {
            throw new Error('Delay must be a non-negative number.');
        }
        this.callback = callback;
        this.delay = delay;
        this.start();
    }

    /**
     * Starts or resumes the timeout.
     * If already running or paused, it will resume from the current state.
     */
    public start(): void {
        if (this.timerId !== null) {
            clearTimeout(this.timerId);
        }

        if (this.remainingTime < 0) return;

        if (this.isPaused && this.remainingTime > 0) {
            // Resume from where we left off
            this.timerId = setTimeout(this.callback, this.remainingTime);
            this.startTime = Date.now();
            this.isPaused = false;
        } else if (this.delay > 0) {
            // Initial start or restart
            this.timerId = setTimeout(this.callback, this.delay);
            this.startTime = Date.now();
            this.remainingTime = this.delay;
            this.isPaused = false;
        } else {
            // If delay is 0, execute immediately.
            this.callback();
            this.clear(); // Ensure resources are cleaned up
        }
    }

    /**
     * Pauses the currently running timeout.
     * The callback will not be executed until `start()` is called again.
     */
    public pause(): void {
        if (this.timerId === null || this.isPaused) {
            return; // Nothing to pause or already paused
        }

        clearTimeout(this.timerId);
        this.timerId = null; // Clear the timer ID
        this.remainingTime -= Date.now() - this.startTime;
        this.isPaused = true;
    }

    /**
     * Clears the timeout, preventing the callback from ever being executed.
     */
    public clear(): void {
        if (this.timerId !== null) {
            clearTimeout(this.timerId);
            this.timerId = null;
        }
        this.remainingTime = 0;
        this.isPaused = false;
    }

    /**
     * Checks if the timeout is currently paused.
     * @returns `true` if paused, `false` otherwise.
     */
    public getIsPaused(): boolean {
        return this.isPaused;
    }

    /**
     * Gets the remaining time before the timeout would fire if not paused.
     * @returns The remaining time in milliseconds.
     */
    public getRemainingTime(): number {
        if (this.isPaused) {
            return this.remainingTime;
        } else if (this.timerId !== null) {
            // Approximate remaining time
            return Math.max(0, this.remainingTime - (Date.now() - this.startTime));
        }
        return 0;
    }
}
