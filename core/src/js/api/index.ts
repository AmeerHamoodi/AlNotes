interface LoginData {
    email: string,
    password: string
};

interface SignupData {
    email: string,
    password: string,
    confirmPassword: string,
    username: string,
    tos: number
};

interface CreateClassData {
    className: string
};


const request = (data: string = "", url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        try {
            const XHR = new XMLHttpRequest();
            XHR.open("POST", url);
            XHR.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

            XHR.onerror = error => {
                reject(error);
            };

            XHR.onload = () => {
                const res = XHR.response;
                resolve(res);
            };

            XHR.send(data);
        } catch (e) {
            reject(e);
        }
    })
}

const API = {
    login(data: LoginData): Promise<string> {
        return new Promise(async (resolve, reject) => {
            if (typeof data.email !== "string" || typeof data.password !== "string") return false;

            try {
                const response = await request(JSON.stringify(data), "/api/auth/login");

                resolve(response);
            } catch (e) {
                console.log(`Error in login API [error]: ${e}`);
                reject(e);
            }
        })

    },
    signup(data: SignupData): Promise<string> {
        return new Promise(async (resolve, reject) => {
            if (typeof data.email !== "string" || typeof data.password !== "string" || typeof data.username !== "string") reject({
                error: true,
                message: "There was an API error!"
            });

            try {
                const response = await request(JSON.stringify(data), "/api/auth/signup");

                resolve(response);
            } catch (e) {
                console.log(`Error in signup API [error]: ${e}`);
                reject(e);
            }
        })
    },
    createClass(data: CreateClassData): Promise<string> {
        return new Promise(async (resolve, reject) => {
            if (typeof data.className !== "string") reject({
                error: true,
                message: "There was an API error!"
            });

            try {
                const response = await request(JSON.stringify(data), "/api/class/create");

                resolve(response);
            } catch (e) {
                console.log(`Error in the createClass API [error]: ${e}`);
                reject(e);
            }
        })
    },
    getClasses(): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await request("", "/api/class/get_all_classes");

                resolve(response);
            } catch(e) {
                console.log(`Error in the getClasses API [error]: ${e}`);
                reject(e);
            }
        })
    },
    deleteClass(id: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                if(typeof id === "undefined" || id === null) reject(JSON.stringify({message: "Error with the API", error: true}));

                const data = JSON.stringify({id});

                const response = await request(data, "/api/class/delete");

                resolve(response);
            } catch(e) {
                console.log(`Error in the deleteClass API [error]: ${e}`);
                reject(e);
            }
        })
    }
};

export default API;