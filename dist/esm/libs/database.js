import { Config } from './config';
import { Misc } from './misc';
export class Database {
    constructor(repo) {
        this.repo = repo;
        this.base_dir = `${Config.WORKSPACE}/db`;
    }
    async autoCreateBase() {
        try {
            const files = await this.repo.fsp.readdir(this.base_dir);
            if (files) {
                Misc.log(`db folder exists!`);
            }
        }
        catch (e) {
            Misc.log(`db folder doesn't exists, skipping...`, e);
            await this.repo.fsp.mkdir(this.base_dir);
        }
    }
    async get(path) {
        try {
            await this.autoCreateBase();
            const folder = `${this.base_dir}`;
            const _path = `${folder}/${path}.json`;
            const file = await this.repo.fsp.readFile(_path);
            const data = String.fromCharCode.apply(null, file);
            return JSON.parse(data);
        }
        catch (e) {
            Misc.log(`Nobe.get failed`, e);
        }
    }
    async set(path, data) {
        let is_success = false;
        const folder = `${this.base_dir}`;
        await this.autoCreateBase();
        try {
            await this.repo.fsp.mkdir(folder, { recursive: true });
        }
        catch (e) {
            Misc.log(`db folder exists, skipping...`);
        }
        try {
            const _path = `${folder}/${path}.json`;
            if (typeof (data) !== 'string') {
                data = JSON.stringify(data);
            }
            Misc.log(`saving to ${_path}...`);
            await this.repo.fsp.writeFile(_path, data);
            is_success = true;
        }
        catch (e) {
            Misc.log(`Nobe.set failed`, e);
        }
        return is_success;
    }
}
//# sourceMappingURL=database.js.map