import { Config } from "./config";
export class Misc {
    static log(...args) {
        if (Config.IS_DEBUG) {
            console.log(...args);
        }
    }
}
//# sourceMappingURL=misc.js.map