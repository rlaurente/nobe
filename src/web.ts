import { WebPlugin } from '@capacitor/core';
import type { NobePlugin } from './definitions';
import { Config } from './config';
import git from 'isomorphic-git'
import http from 'isomorphic-git/http/web'
import LightningFS from '@isomorphic-git/lightning-fs'


const fs = new LightningFS("fs");
const fsp = fs.promises;
const proxy_url = 'https://cors.isomorphic-git.org';

export class NobeWeb extends WebPlugin implements NobePlugin {

  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }

  async init(options: { url: string, workspace?: string, branch?: string }): Promise<{ is_success: boolean }> {
    let is_success = false;
    Config.GIT_URL = options.url;
    if (options.workspace) {
      Config.WORKSPACE = options.workspace;
    }

    if(options.branch){
      Config.BRANCH = options.branch;
    }

    const dir = Config.WORKSPACE;
    let has_git = false;
    try {
      const files = await fsp.readdir(dir);
      if (files.indexOf('.git') > -1) {
        has_git = true;
      }
    } catch (e) {
      await fsp.mkdir(dir);
    }

    if (!has_git) {
      try{
        await NobeWeb.clone();
        is_success = true;
      }catch(e){
        console.log(`clone failed`, e); 
      }
    } else {
      const has_updates = await NobeWeb.checkUpdates();
      if (has_updates) {
        await NobeWeb.pull();
      }
      is_success = true;
    }

    return {
      is_success: is_success
    }
  }

  async switchBranch(options: {branch_name: string}): Promise<{ is_success: boolean}> {
    let is_success = false;
    try{
      console.log(`Switching to branch ${options.branch_name}...`);
      Config.BRANCH = options.branch_name;
      await git.checkout({
        fs,
        dir: Config.WORKSPACE,
        ref: Config.BRANCH
      });
      const has_updates = await NobeWeb.checkUpdates();
      if (has_updates) {
        await NobeWeb.pull();
      }
      is_success = true;
    }catch(e){
      console.log(e, `failed to switch branch`)
    }
    return {
      is_success: is_success
    }
  }

  private static async checkUpdates(): Promise<Boolean> {
    console.log(`Checking updates...`);
    let has_updates = false;
    const local_refs = await git.log({
      fs,
      dir: Config.WORKSPACE,
      depth: 1,
      ref: Config.BRANCH
    })
    if (local_refs && local_refs.length > 0) {
      const local_oid = local_refs[0].oid;

      const remote_refs = await git.listServerRefs({
        url: Config.GIT_URL,
        http,
        corsProxy: proxy_url,
        prefix: `refs/heads/${Config.BRANCH}`,
        symrefs: true,
      });

      if (remote_refs && remote_refs.length > 0) {
        const remote_oid = remote_refs[0].oid;
        if (remote_oid != local_oid) {
          has_updates = true;
        }
      }
    }
    if(has_updates){
      console.log(`Updates detected`);
    }else{
      console.log(`Up to date`);
    }
    return has_updates;
  }

  private static async clone() {
    console.log(`Cloning...`);
    const result = await git.clone({
      url: Config.GIT_URL,
      corsProxy: proxy_url,
      fs,
      http,
      ref: Config.BRANCH,
      singleBranch: true,
      depth: 1,
      dir: Config.WORKSPACE
    });
    return result;
  }

  private static async pull() {
    console.log(`Pulling updates...`);
    const result = await git.fastForward({
      fs,
      http,
      dir: Config.WORKSPACE,
      ref: Config.BRANCH
    });
    console.log('Done pulling!')
    return result;
  }


}
