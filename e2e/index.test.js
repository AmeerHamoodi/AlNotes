const assert = require("assert");
const path = require("path");
const Application = require("spectron").Application;
const electronPath = require("electron");

const app = new Application({
    path: electronPath,
    args: [path.join(__dirname, "../dist/app.js")]
});

describe("Overall app test", function () {
    process.env.NODE_ENV = "TESTING";
    this.timeout(20000);

    beforeEach(() => app.start());

    afterEach(() => {
        if (app && app.isRunning()) {
            return app.stop();
        }
    });
    it("Should show 1 window", async function () {
        await app.client.waitUntilWindowLoaded();
        const count = await app.client.getWindowCount();

        assert(count === 1, "Incorrect number of windows");
    });
    //HOME PAGE TEST
    it("Should create new classes", async function () {
        const classes = ["Bio1a03", "Chemistry Class"];
        await app.client.waitUntilWindowLoaded();

        for (let i = 0; i < classes.length; i++) {
            const input = await (await app.client.$("#classname")).setValue(classes[i]);
            const button = await app.client.$("#createNew");
            button.click();
        }

        const cardsContainer = await app.client.$(".gridish-flow");
        const cards = await cardsContainer.$$(".ui.card.mt");

        assert(cards.length === 2, "Could not create all classes!");
    });
    it("Should delete all classes", async function () {
        await app.client.waitUntilWindowLoaded();
        const buttons = await app.client.$$(".ui.bottom.attached.button.red");

        for (let i = 0; i < buttons.length; i++) {
            buttons[i].click();
        }

        const newButtons = await app.client.$$(".ui.bottom.attached.button.red");

        assert(newButtons.length === 0, "Could not delete all classes");
    });
})