import { Config } from "../config";

export class Misc {
    static log(...args: any) {
        if(Config.IS_DEBUG){
            console.log(...args);
        }
    }
}