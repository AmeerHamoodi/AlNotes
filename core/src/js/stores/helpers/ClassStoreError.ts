class ClassStoreError extends Error {
    constructor(message: string) {
        super(message);
        this.message = message;
        this.name = "Class Store Error";
    }
};

export default ClassStoreError;