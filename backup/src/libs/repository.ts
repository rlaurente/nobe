import { Config } from '../config';
import http from 'isomorphic-git/http/web'
import git from 'isomorphic-git'
import LightningFS from '@isomorphic-git/lightning-fs'
import { Misc } from './misc';

const proxy_url = 'https://cors.isomorphic-git.org';

export class Repository {

    public fs: any;
    public fsp: any;

    constructor(is_wipe: boolean = false) {
        this.fs = new LightningFS('fs', { wipe: is_wipe } as any);
        this.fsp = this.fs.promises;
    }

    async checkUpdates(): Promise<Boolean> {
        Misc.log(`Checking updates...`);
        let has_updates = false;
        const local_refs = await git.log({
            fs: this.fs,
            dir: Config.WORKSPACE,
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
        if (has_updates) {
            Misc.log(`Updates detected`);
        } else {
            Misc.log(`Up to date`);
        }
        return has_updates;
    }

    async clone() {
        Misc.log(`Cloning...`);
        const result = await git.clone({
            url: Config.GIT_URL,
            corsProxy: proxy_url,
            fs: this.fs,
            http,
            ref: Config.BRANCH,
            dir: Config.WORKSPACE
        });
        return result;
    }

    async pull() {
        Misc.log(`Pulling updates...`);
        const result = await git.pull({
            fs: this.fs,
            http,
            author: {
                name: 'Nobe Client',
                email: 'nobeclient@gmail.com',
            },
            dir: Config.WORKSPACE,
            ref: Config.BRANCH
        });
        Misc.log('Done pulling!')
        return result;
    }

    async push() {
        Misc.log(`Pushing updates...`);
        const repo = {
            url: Config.GIT_URL,
            corsProxy: proxy_url,
            fs: this.fs,
            http,
            ref: Config.BRANCH,
            dir: Config.WORKSPACE
        };

        await git.statusMatrix(repo).then((status) =>
            Promise.all(
                status.map(([filepath, , worktreeStatus]) =>
                    worktreeStatus ? git.add({ ...repo, filepath }) : git.remove({ ...repo, filepath })
                )
            )
        )

        await git.commit({
            ...repo,
            author: {
                name: 'Nobe Client',
                email: 'nobeclient@gmail.com',
            },
            message: 'Nobe added updates'
        });

        const push_result = await git.push({
            fs: this.fs,
            http,
            dir: Config.WORKSPACE,
            remote: 'origin',
            ref: Config.BRANCH
        });
        Misc.log(push_result)
        return push_result.ok;
    }
}