export declare class Repository {
    fs: any;
    fsp: any;
    constructor(is_wipe?: boolean);
    checkUpdates(): Promise<Boolean>;
    clone(): Promise<void>;
    pull(): Promise<void>;
    push(): Promise<boolean>;
}
