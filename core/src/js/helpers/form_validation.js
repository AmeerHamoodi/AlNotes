const emailRegex = /^ (([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1, 3}\.[0-9]{1, 3}\.[0-9]{1, 3}\.[0-9]{1, 3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

const validateSignup = data => {
    return new Promise((resolve, reject) => {
        const { username, password, email } = data;

        const usernameIsValid = typeof username === "string" && 3 <= username.length <= 50;
        const passwordIsValid = typeof password === "string" && passwordRegex.test(password);
        const emailIsValid = typeof email === "string" && emailRegex.test(email);

        if (!usernameIsValid) reject("Username must be between 3 and 50 characters");
        if (!passwordIsValid) reject("Please enter a password with 1 uppercase letter, 1 lowercase letter, 1 special character and 1 number. Minimum of 8 characters");
        if (!emailIsValid) reject("Please enter a valid email");

        resolve("Success!");

    });
}


export { validateSignup };