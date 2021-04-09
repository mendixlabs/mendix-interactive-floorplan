const getDebugger = (name = "mendix.interactive.floorplan"): ((...args: unknown[]) => void) => {
    const debug = (...args: unknown[]): void => {
        // @ts-ignore
        if (mx.logger) {
            // @ts-ignore
            (mx.logger as mendix.Logger).debug(`${name}:`, ...args);
        } else if (window.logger) {
            window.logger.debug(`${name}:`, ...args);
        }
    };
    return debug;
};

export default getDebugger;
