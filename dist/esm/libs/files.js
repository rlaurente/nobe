import { Config } from './config';
import { Misc } from './misc';
export class Files {
    constructor(repo) {
        this.repo = repo;
        this.base_dir = `${Config.WORKSPACE}/files`;
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
    async save(file) {
        await this.autoCreateBase();
        const extension = file.name.split('.').pop();
        const filename = `${new Date().getTime().toString()}.${extension}`;
        try {
            const path = `${this.base_dir}/${filename}`;
            Misc.log(`saving to ${path}...`);
            const data = await this.fileToArrayBuffer(file);
            await this.repo.fsp.writeFile(path, new Uint8Array(data));
            return {
                filename: filename,
                data: await URL.createObjectURL(data)
            };
        }
        catch (e) {
            Misc.log(`upload failed`, e);
        }
    }
    async get(filename) {
        await this.autoCreateBase();
        try {
            const path = `${this.base_dir}/${filename}`;
            Misc.log(`getting file ${path}...`);
            const raw_file = await this.repo.fsp.readFile(path);
            console.log(raw_file, 'raw_file');
            return URL.createObjectURL(raw_file);
        }
        catch (e) {
            Misc.log(`convert path to base64 failed`, e);
        }
    }
    fileToArrayBuffer(file) {
        file.arrayBuffer;
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
}
//# sourceMappingURL=files.js.map