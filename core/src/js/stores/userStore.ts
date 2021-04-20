import { observable, action, makeObservable } from "mobx";

import { UserStoreInterface } from "./interfaces";

/**
 * Store for the user data [username and token]
 */

class UserStore implements UserStoreInterface {
    username: string;

    constructor() {
        this.username = localStorage.getItem("userData") || "Loading...";

        makeObservable(this, {
            username: observable,
            setUsername: action
        });

    }
    /**
     * Stores username obtained from DB in LS
     */
    setUsername(username: string) {
        if (typeof username == "string") {
            try {
                this.username = username;
                localStorage.setItem("userData", username);
            } catch (e) {
                console.log("Error 1 with the UserStore occurred. Please email ahamoodi178@gail.com with the error number");

            }
        }
    }
};

export default UserStore;