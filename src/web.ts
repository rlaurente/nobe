import { WebPlugin } from '@capacitor/core';
import type { NobePlugin} from './definitions';
import { Config } from './config';
import { Repository } from './libs/repository';
import { Database } from './libs/database';
import { findWhere, findIndex } from 'underscore';

interface MockRequestMap {
  path: string,
  handler: any
};

export class NobeWeb extends WebPlugin implements NobePlugin {

  private fsp: any;
  private repo: any;
  private is_mock: boolean = true;

  async init(options: { url: string, workspace?: string, branch?: string, wipe?: boolean}): Promise<{ is_success: boolean }> {
    let is_success = false;
    Config.GIT_URL = options.url;
    if (options.workspace) {
      Config.WORKSPACE = options.workspace;
    }

    if (options.branch) {
      Config.BRANCH = options.branch;
    }

    const repo = new Repository();
    this.fsp = repo.fsp;
    this.repo = repo;

    const dir = Config.WORKSPACE;

    let has_git = false;
    try {
      const files = await this.fsp.readdir(dir);
      if (files && files.indexOf('.git') > -1) {
        has_git = true;
      }
    } catch (e) {
      await this.fsp.mkdir(dir);
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

  async switchBranch(options: { branch_name: string }): Promise<{ is_success: boolean }> {
    let is_success = false;
    try {
      console.log(`Switching to branch ${options.branch_name}...`);
      Config.BRANCH = options.branch_name;
      await this.init({
        url: Config.GIT_URL,
        branch: Config.BRANCH,
        workspace: Config.WORKSPACE,
        wipe: true
      });
      is_success = true;
    } catch (e) {
      console.log(e, `failed to switch branch`);
    }
    return {
      is_success: is_success
    }
  }

  async get(options: { key: string; }): Promise<any> {
    const db = new Database();
    db.fsp = this.fsp;
    const result = await db.get(options.key);
    return result;
  }

  async set(options: { key: string; data: any; }): Promise<boolean> {
    const db = new Database();
    db.fsp = this.fsp;
    const result = await db.set(options.key, options.data);
    return result;
  }

  async apply(): Promise<boolean> {
    return this.repo.push();
  }

  async request(options: { path: string, type: string, data?: any, headers?: any}): Promise<any> {
    if (this.is_mock) {
      const mock = findWhere(Config.MOCKS, {
        path: options.path
      });
      if(mock){
        const result = await mock.handler(options.data);
        return result;
      }else{
        throw `Mock doesn't exists for ${options.path}`;
      }
    }else{
      throw `No api implementations yet!`
    }
  }

  mock(options: { path: string; handler: any; }): void {
    const index = findIndex(Config.MOCKS, (item: MockRequestMap)=>{
      return item.path === options.path;
    });
    if(index > -1){
      Config.MOCKS[index] = options;
    }else{
      Config.MOCKS.push(options);
    }
  }


}
