import { Config, MockRequestMap, TransformerMap } from './libs/config';
import { Repository } from './libs/repository';
import { Database } from './libs/database';
import { Files } from './libs/files';
import { findWhere, findIndex } from 'underscore';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface TransformRequest {
    (options: AxiosRequestConfig): AxiosRequestConfig;
}

export function setConfig(options: { is_mock: boolean; is_debug: boolean; }): void {
    Config.IS_DEBUG = options.is_debug;
    Config.IS_MOCK = options.is_mock;
}

export async function init(options: { git_url: string, workspace?: string, branch?: string, wipe?: boolean }): Promise<{ is_success: boolean }> {
    let is_success = false;
    Config.GIT_URL = options.git_url;
    if (options.workspace) {
        Config.WORKSPACE = options.workspace;
    }

    if (options.branch) {
        Config.BRANCH = options.branch;
    }

    const repo = new Repository();
    const dir = Config.WORKSPACE;

    let has_git = false;
    try {
        const files = await repo.fsp.readdir(dir);
        if (files && files.indexOf('.git') > -1) {
            has_git = true;
        }
    } catch (e) {
        await repo.fsp.mkdir(dir);
    }

    if (!has_git) {
        try {
            await repo.clone();
            is_success = true;
        } catch (e) {
            console.log(`clone failed`, e);
        }
    } else {
        const has_updates = await repo.checkUpdates();
        if (has_updates) {
            await repo.pull();
        }
        is_success = true;
    }

    return {
        is_success: is_success
    }
}

export async function get(options: { key: string; }): Promise<any> {
    const repo = new Repository();
    const db = new Database(repo);
    const result = await db.get(options.key);
    return result;
}

export async function set(options: { key: string; data: any; }): Promise<boolean> {
    const repo = new Repository();
    const db = new Database(repo);
    const result = await db.set(options.key, options.data);
    return result;
}

export async function apply(): Promise<boolean> {
    const repo = new Repository();
    return repo.push();
}

export async function request(options: AxiosRequestConfig): Promise<AxiosResponse> {
    if (Config.IS_MOCK) {
        const mock = findWhere(Config.MOCKS, {
            url: options.url
        });
        if (mock) {
            const result = await mock.handler(options);
            return result;
        } else {
            throw `Mock doesn't exists for ${options.url}`
        }
    } else {
        let _options = {
            ...options
        };
        const response_transformer = findWhere(Config.TRANSFORMERS, {
            url: options.url
        });

        //  apply request
        if(response_transformer){
            _options = response_transformer.onRequest(_options);
        }
        let response = await axios(_options);

        //  apply response
        if(response_transformer){
            response = response_transformer.onResponse(response.data);
        }
        return response;
    }
}

export async function upload(file: File) {
    const repo = new Repository();
    const files = new Files(repo);
    const result = await files.save(file);
    return result;
}

export async function getUploadedFile(filename: string) {
    const repo = new Repository();
    const files = new Files(repo);
    const result = await files.get(filename);
    return result;
}

export function mock(options: { url: string; handler: any; }): void {
    const index = findIndex(Config.MOCKS, (item: MockRequestMap) => {
        return item.url == options.url;
    });
    if (index > -1) {
        Config.MOCKS[index] = options;
    } else {
        Config.MOCKS.push(options);
    }
}

export function transform(options: { url: string, onRequest: TransformRequest, onResponse: any }): void {
    const index = findIndex(Config.TRANSFORMERS, (item: TransformerMap) => {
        return item.url == options.url;
    });
    if (index > -1) {
        Config.TRANSFORMERS[index] = options;
    } else {
        Config.TRANSFORMERS.push(options);
    }
}