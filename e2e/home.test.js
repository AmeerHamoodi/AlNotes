const assert = require("assert");
const path = require("path");
const Application = require("spectron").Application;
const electronPath = require("electron");

const app = new Application({
    path: electronPath,
    args: [path.join(__dirname, "../dist")]
});

describe("Home page tests", () => {
    this.timeout(10000);

    beforeEach(() => {
        return app.start();
    });

    afterEach(() => {
        if (app && app.isRunning()) {
            return app.stop();
        }
    });

})