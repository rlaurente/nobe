import { AxiosRequestConfig, AxiosResponse } from 'axios';
export declare function setConfig(options: {
    is_mock: boolean;
    is_debug: boolean;
}): void;
export declare function init(options: {
    git_url: string;
    workspace?: string;
    branch?: string;
    wipe?: boolean;
}): Promise<{
    is_success: boolean;
}>;
export declare function get(options: {
    key: string;
}): Promise<any>;
export declare function set(options: {
    key: string;
    data: any;
}): Promise<boolean>;
export declare function apply(): Promise<boolean>;
export declare function request(options: AxiosRequestConfig): Promise<AxiosResponse>;
export declare function upload(file: File): Promise<any>;
export declare function fileToBase64(filename: string): Promise<string | undefined>;
export declare function mock(options: {
    url: string;
    handler: any;
}): void;
