class ClassResponseError extends Error {
    constructor(message: any) {
        super(message);
        this.message = message;
        this.name = "Class Response Error";
    }
};

export default ClassResponseError;