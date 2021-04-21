class StoreError extends Error {
    constructor(message: string) {
        super(message);
        this.message = message;
        this.name = "Store Error";
    }
};

export default StoreError;