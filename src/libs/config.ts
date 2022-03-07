export interface MockRequestMap {
    url: string,
    handler: any
};

export interface TransformerMap {
    url: string,
    onRequest?: any,
    onResponse?: any
};

export class Config {
    public static GIT_URL: string = '';
    public static WORKSPACE: string = '/workspace';
    public static BRANCH: string = 'main';
    public static IS_DEBUG: boolean = true;
    public static MOCKS: MockRequestMap[] = [];
    public static API_URL: string = '';
    public static IS_MOCK: boolean = true;
    public static TRANSFORMERS: TransformerMap[] = [];
}