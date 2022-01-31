import { Config } from './libs/config';
import { Repository } from './libs/repository';
import { Database } from './libs/database';
import { Files } from './libs/files';
import { findWhere, findIndex } from 'underscore';
import axios from 'axios';
export function setConfig(options) {
    Config.IS_DEBUG = options.is_debug;
    Config.IS_MOCK = options.is_mock;
}
export async function init(options) {
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
    }
    catch (e) {
        await repo.fsp.mkdir(dir);
    }
    if (!has_git) {
        try {
            await repo.clone();
            is_success = true;
        }
        catch (e) {
            console.log(`clone failed`, e);
        }
    }
    else {
        const has_updates = await repo.checkUpdates();
        if (has_updates) {
            await repo.pull();
        }
        is_success = true;
    }
    return {
        is_success: is_success
    };
}
export async function get(options) {
    const repo = new Repository();
    const db = new Database(repo);
    const result = await db.get(options.key);
    return result;
}
export async function set(options) {
    const repo = new Repository();
    const db = new Database(repo);
    const result = await db.set(options.key, options.data);
    return result;
}
export async function apply() {
    const repo = new Repository();
    return repo.push();
}
export async function request(options) {
    if (Config.IS_MOCK) {
        const mock = findWhere(Config.MOCKS, {
            url: options.url
        });
        if (mock) {
            const result = await mock.handler(options);
            return result;
        }
        else {
            throw `Mock doesn't exists for ${options.url}`;
        }
    }
    else {
        return axios(options);
    }
}
export async function upload(file) {
    const repo = new Repository();
    const files = new Files(repo);
    const result = await files.save(file);
    return result;
}
export function mock(options) {
    const index = findIndex(Config.MOCKS, (item) => {
        return item.url == options.url;
    });
    if (index > -1) {
        Config.MOCKS[index] = options;
    }
    else {
        Config.MOCKS.push(options);
    }
}
//# sourceMappingURL=web.js.map