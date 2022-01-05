import { WebPlugin } from '@capacitor/core';
import type { NobePlugin } from './definitions';
import { Config } from './config';
import { Repository } from './libs/repository';
import { Database } from './libs/database';
import { findWhere, findIndex } from 'underscore';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

interface MockRequestMap {
  url: string,
  handler: any
};

export class NobeWeb extends WebPlugin implements NobePlugin {

  private fsp: any;
  private repo: any;

  setConfig(options: { is_mock: boolean; is_debug: boolean; }): void {
    Config.IS_DEBUG = options.is_debug;
    Config.IS_MOCK = options.is_mock;
  }

  async init(options: { git_url: string, workspace?: string, branch?: string, wipe?: boolean }): Promise<{ is_success: boolean }> {
    let is_success = false;
    Config.GIT_URL = options.git_url;
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
        git_url: Config.GIT_URL,
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

  async request(options: AxiosRequestConfig): Promise<AxiosResponse> {
    if (Config.IS_MOCK) {
      const mock = findWhere(Config.MOCKS, {
        url: options.url
      });
      if (mock) {
        const result = await mock.handler(options.data);
        return result;
      } else {
        throw `Mock doesn't exists for ${options.url}`;
      }
    } else {
      return axios(options);
    }
  }

  mock(options: { url: string; handler: any; }): void {
    const index = findIndex(Config.MOCKS, (item: MockRequestMap) => {
      return item.url == options.url;
    });
    if (index > -1) {
      Config.MOCKS[index] = options;
    } else {
      Config.MOCKS.push(options);
    }
  }


}
