export declare class Database {
    private repo;
    private base_dir;
    constructor(repo: any);
    autoCreateBase(): Promise<void>;
    get(path: string): Promise<any>;
    set(path: string, data: any): Promise<boolean>;
}
