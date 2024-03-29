const MemoryStream = require('memory-stream');
const nodePath = require('path');
const logger = require('./Logger');

const UNIX_SEP_REGEX = /\//g;
const WIN_SEP_REGEX = /\\/g;

class MemoryFileSystem {

    constructor() {
        this.storage = {};
        this.cwd = '/';
        this.root = process.cwd();
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
        return this.cwd;
    }

    chdir(path) {
        const {clientPath} = this._resolvePath(path);

        this.cwd = clientPath;
        return clientPath;
    }

    mkdir(dir) {
        return dir;
    }

    delete(filename) {
        return Promise.resolve();
    }

    list() {
        return [];
    }

    get(filename) {

        if (filename !== '.') {
            return Promise.reject('File "' + filename + '" not found.');
        }

        const fakeTime = Date.now();

        // Fake STAT to fake an empty directory
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
            throw new Error('Unsupported');
        }

        logger.info({filename}, 'Upload started');

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
