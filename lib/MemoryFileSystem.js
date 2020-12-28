const MemoryStream = require('memory-stream');

class MemoryFileSystem {

    constructor() {
        this.storage = {};
    }

    currentDirectory() {
        return '/';
    }

    chdir(path) {
    }

    list() {
        return [];
    }

    get(filename) {
        const fakeTime = Date.now();

        return {
            dev: 3538821179,
            mode: 16822,
            nlink: 1,
            uid: 0,
            gid: 0,
            rdev: 0,
            blksize: 4096,
            ino: 7599824371330281,
            size: 1,
            blocks: 1,
            atimeMs: +fakeTime,
            mtimeMs: +fakeTime,
            ctimeMs: +fakeTime,
            birthtimeMs: +fakeTime,
            atime: fakeTime,
            mtime: fakeTime,
            ctime: fakeTime,
            birthtime: fakeTime,
            isDirectory: _ => true
        };
    }

    write(filename, options) {
        if (options && options.append === true) {
            throw new Error("Unsupported");
        }

        this.storage[filename] = new MemoryStream();

        return {
            stream: this.storage[filename],
            clientPath: filename
        };
    }

    removeUploaded(filename) {
        delete this.storage[filename];
    }

    getUploaded(filename) {
        return this.storage[filename];
    }
}

module.exports = MemoryFileSystem;