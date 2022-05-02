const MemoryStream = require('memory-stream');
const nodePath = require('path');

const UNIX_SEP_REGEX = /\//g;
const WIN_SEP_REGEX = /\\/g;

class MemoryFileSystem {

    constructor() {
        this.storage = {};
        this.cwd = '/';
        this.root = process.cwd();
        this.fs = {};

        const {fsPath} = this._resolvePath(this.cwd);
        this.fs[fsPath] = this.__fakeInode('.', true);
    }

    _resolvePath(path = '.') {
        // Unix separators normalize nicer on both unix and win platforms
        const resolvedPath = path.replace(WIN_SEP_REGEX, '/');

        // Join cwd with new path
        const joinedPath = nodePath.isAbsolute(resolvedPath)
            ? nodePath.normalize(resolvedPath)
            : nodePath.join('/', this.cwd, resolvedPath);

        // Create local filesystem path using the platform separator
        const fsPath = nodePath.resolve(nodePath.join(this.root, joinedPath)
            .replace(UNIX_SEP_REGEX, nodePath.sep)
            .replace(WIN_SEP_REGEX, nodePath.sep));

        // Create FTP client path using unix separator
        const clientPath = joinedPath.replace(WIN_SEP_REGEX, '/');

        return {
            clientPath,
            fsPath
        };
    }

    currentDirectory() {
        console.log("ftp.currentDirectory", this.cwd);
        return this.cwd;
    }

    chdir(path) {
        const {clientPath} = this._resolvePath(path);

        console.log("ftp.chdir", path, clientPath);
        this.cwd = clientPath;
        return clientPath;
    }

    mkdir(dir) {
        console.log("ftp.mkdir", dir);

        const {fsPath} = this._resolvePath(dir);
        this.fs[fsPath] = this.__fakeInode(dir, true);

        return dir;
    }

    rename(from, to) {
        console.log("ftp.rename", from, to);

        const {fsPath: fromPath} = this._resolvePath(from);
        const {fsPath: toPath} = this._resolvePath(to);


        if (this.fs[fromPath]) {
            this.fs[toPath] = this.fs[fromPath];
            this.fs[toPath].name = to;

            delete this.fs[fromPath];
        }

        console.log("dbg.rename", this.fs);

        return this.fs[toPath];
    }

    delete(filename) {
        console.log("ftp.delete", filename);

        const {fsPath} = this._resolvePath(filename);
        delete this.fs[fsPath];

        return Promise.resolve();
    }

    list() {
        return Object
            .keys(this.fs)
            .map(key => this.fs[key])
            .filter(file => this.cwd === file.cwd)
    }

    get(filename) {
        console.log("ftp.get", filename);

        const {fsPath} = this._resolvePath(filename);
        if (this.fs[fsPath]) {
            return this.fs[fsPath];
        }

        throw new Error('File not found');
    }

    write(filename, options) {
        console.log("ftp.write", filename, options);
        if (options && options.append === true) {
            throw new Error('Unsupported');
        }

        const {fsPath} = this._resolvePath(filename);
        this.fs[fsPath] = this.__fakeInode(filename, false);

        console.log("dbg.write", this.fs);

        this.storage[filename] = new MemoryStream();

        return {
            stream: this.storage[filename],
            clientPath: filename
        };
    }

    removeUploaded(filename) {
        console.log("ftp.removeUploaded", filename);
        delete this.storage[filename];
    }

    getUploaded(filename) {
        console.log("ftp.getUploaded", filename);
        return this.storage[filename];
    }

    __fakeInode(filename, isDirectory) {
        const fakeTime = Date.now();
        const inode = Math.floor(Math.random() * 10000000);

        return {
            dev: 3538821179,
            mode: 16822,
            nlink: 1,
            uid: 0,
            gid: 0,
            rdev: 0,
            blksize: 4096,
            ino: inode,
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
            name: filename,
            cwd: this.cwd,
            isDirectory: _ => isDirectory
        };
    }
}

module.exports = MemoryFileSystem;
