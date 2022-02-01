export declare class Files {
    private repo;
    private base_dir;
    constructor(repo: any);
    autoCreateBase(): Promise<void>;
    save(file: File): Promise<any>;
    get(filename: string): Promise<void>;
    private fileToBase64;
    private fileToArrayBuffer;
}
