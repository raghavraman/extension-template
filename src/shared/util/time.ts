type TimeUnit = number;

export const MILLISECOND: TimeUnit = 1;
export const SECOND: TimeUnit = 1000 * MILLISECOND;
export const MINUTE: TimeUnit = 60 * SECOND;
export const HOUR: TimeUnit = 60 * MINUTE;
export const DAY: TimeUnit = 24 * HOUR;

interface AwaitUntilOptions {
    timeout?: number;
    interval?: number;
    silentTimeout?: boolean;
}

export const awaitUntil = (
    predicate: () => boolean,
    options: AwaitUntilOptions = {
        timeout: 1000,
        interval: 100,
    }
): Promise<void> =>
    Promise.any([
        new Promise<void>(resolve => {
            const interval = setInterval(() => {
                if (predicate()) {
                    clearInterval(interval);
                    resolve();
                }
            }, options.interval);
        }),
        sleep(options.timeout!).then(() => {
            throw new Error(`awaitUntil timed out after ${options.timeout}ms`);
        }),
    ]);

/**
 *
 */
export const sleep = (milliseconds: number | TimeUnit): Promise<void> =>
    new Promise(resolve => setTimeout(resolve, milliseconds));

/**
 * Checks to see if expired by the time first stored and the time frame that it is stored for
 *
 * @param time time it was stored
 * @param threshold time frame it can be stored for
 * @return true if expired, false if the time frame is still in range
 */
export const didExpire = (time: number, threshold: number | TimeUnit): boolean => time + threshold <= Date.now();

