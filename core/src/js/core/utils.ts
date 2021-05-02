interface UTILS_Static {
    /** Gets current time as a string */
    getTime: () => string
}

const UTILS = {
    /** Gets current time as a string */
    getTime(): string {
        const d = new Date();
        const dString = d.toLocaleTimeString()


        return dString;
    }
};

export default UTILS;
export { UTILS, UTILS_Static };
