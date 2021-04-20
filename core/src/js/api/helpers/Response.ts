/**
 * Class for all API responses
 */
class ApiResponse {
    message: string | object | object[] | string[];
    error?: boolean;

    /**
     * @param message Message to be recieved by users
     * @param error Whether an error occurred or not
     */
    constructor(message: string | object | object[] | string[], error?: boolean) {
        this.message = message;
        this.error = typeof error == "boolean" ? error : false;
    }

    /**
     * Returns the display object for a response
     */
    get export() {
        return {
            message: this.message,
            error: this.error
        }
    }
};

type ApiResponseExport = {
    message: string | object,
    error: boolean
}

export default ApiResponse;

export { ApiResponseExport, ApiResponse };
