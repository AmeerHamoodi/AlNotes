type KeyboardData = {
    key: number,
    shortKey?: boolean,
    shiftKey?: boolean,
    altKey?: boolean
}

interface KeyboardSettingFrontInterface {
    keyData: string
}

const getRealChar = (keyCode: number) => String.fromCharCode((96 <= keyCode) ? (keyCode - 48 * Math.floor(keyCode / 48)): keyCode);

class KeyboardSettingFront implements KeyboardSettingFrontInterface {
    private key: number;
    private shortKey: boolean;
    private shiftKey: boolean;
    private altKey: boolean;

    public keyData: string;

    constructor(keyboardData: KeyboardData) {
        this.key = keyboardData.key;

        this.shortKey = typeof keyboardData.shortKey === "boolean" ? keyboardData.shortKey : false;
        this.shiftKey = typeof keyboardData.shiftKey === "boolean" ? keyboardData.shiftKey : false;
        this.altKey = typeof keyboardData.altKey === "boolean" ? keyboardData.altKey : false;

        this.keyData = `${this.shortKey ? "CTRL+" : ""}${this.shiftKey ? "SHIFT+" : ""}${this.altKey ? "ALT+" : ""}${getRealChar(this.key)}`;
    }
};

export default KeyboardSettingFront;
export { KeyboardSettingFrontInterface, KeyboardData };