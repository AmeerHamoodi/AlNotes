class ResponseError extends Error {
    constructor(message: any) {
        super(message);
        this.message = message;
        this.name = "Store Response Error";
    }
};

export default ResponseError;