import ApiResponse, { ApiResponseExport } from "./helpers/Response";

const { ipcRenderer } = window.require("electron");

/**
 * Object for all of the class api methods
 */
const classApi = {
    /**
     * Gets all of the class data
     */
    getClasses(): Promise<ApiResponseExport> {
        return new Promise((resolve, reject) => {
            try {
                ipcRenderer.on("getAllClasses:response", (event: object, data: object[]) => {
                    console.log("Classes fetched");
                    if (Array.isArray(data)) {
                        const response = new ApiResponse(data, false);
                        resolve(response.export);
                    } else {
                        const response = new ApiResponse("Invalid class data returned", true);
                        reject(response.export);
                    }
                })

                ipcRenderer.send("getAllClasses");

            } catch (e) {
                const response = new ApiResponse("An error with classApi.getClasses has occurred!", true);
                console.log(e);
                reject(response.export);
            }
        })
    }
};

export default classApi;