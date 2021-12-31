interface MockRequestMap {
    path: string,
    handler: any
};

export class Config {
    public static GIT_URL: string = '';
    public static WORKSPACE: string = '/workspace';
    public static BRANCH: string = 'main';
    public static IS_DEBUG: boolean = true;
    public static MOCKS: MockRequestMap[] = [];
}