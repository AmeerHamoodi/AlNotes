interface SignupStoreInterface {
    completedData: any,
    sendData: (username: string, email: string, password: string, confirmPassword: string, tos: number) => void
};

interface UserStoreInterface {
    username: string,
    setUsername: (username: string) => void
};

interface ClassesStoreInterface {
    classes: object[],
    classesLoaded: boolean,
    errorContent: {
        occured: boolean,
        data: any
    },
    getClasses: () => void,
    createClass: (className: string) => void,
    deleteClass: (id: string) => void
};

interface LoginStoreInterface {
    completedData: any,
    sendData: (email: string, password: string) => void
};

export { SignupStoreInterface, UserStoreInterface, ClassesStoreInterface, LoginStoreInterface };