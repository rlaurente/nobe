export interface MockRequestMap {
    url: string;
    handler: any;
}
export interface TransformerMap {
    url: string;
    onRequest?: any;
    onResponse?: any;
}
export declare class Config {
    static GIT_URL: string;
    static WORKSPACE: string;
    static BRANCH: string;
    static IS_DEBUG: boolean;
    static MOCKS: MockRequestMap[];
    static API_URL: string;
    static IS_MOCK: boolean;
    static TRANSFORMERS: TransformerMap[];
}
