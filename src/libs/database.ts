import { Config } from '../config';
import { Misc } from './misc';

export class Database {
    public fsp: any;
    public base_dir: string;

    constructor(private _fsp: any) {
        this.fsp = _fsp;
        this.base_dir = `${Config.WORKSPACE}/db`;
        this.init();
    }

    async init() {
        try {
            const files = await this.fsp.readdir(this.base_dir);
            if (files) {
                Misc.log(`db folder exists!`)
            }
        } catch (e) {
            Misc.log(`db folder exists, skipping...`, e)
            await this.fsp.mkdir(this.base_dir);
        }
    }

    async get(path: string): Promise<any> {
        try {
            const folder = `${this.base_dir}`;
            const _path = `${folder}/${path}.json`;
            const file = await this.fsp.readFile(_path);
            const data = String.fromCharCode.apply(null, file);
            return JSON.parse(data);
        } catch (e) {
            Misc.log(`Nobe.get failed`, e);
        }
    }

    async set(path: string, data: any): Promise<boolean> {
        let is_success = false;
        const folder = `${this.base_dir}`;
        try {
            await this.fsp.mkdir(folder, { recursive: true });
        } catch (e) {
            Misc.log(`db folder exists, skipping...`);
        }

        try {
            const _path = `${folder}/${path}.json`;
            if (typeof (data) !== 'string') {
                data = JSON.stringify(data);
            }
            Misc.log(`saving to ${_path}...`)
            await this.fsp.writeFile(_path, data);
            is_success = true;
        } catch (e) {
            Misc.log(`Nobe.set failed`, e);
        }
        return is_success;

    }
}