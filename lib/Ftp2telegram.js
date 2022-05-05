const FtpSrv = require('ftp-srv');
const isInSubnet = require('is-in-subnet');
const os = require('os');

const TelegramProxy = require('./TelegramProxy');
const MemoryFileSystem = require('./MemoryFileSystem');
const logger = require('./Logger');

class Ftp2Telegram {

    constructor(config) {
        this.config = config;
        this.telegramProxy = new TelegramProxy(config.telegram);

        const ftpConfig = {
            url: config.ftp.url,
            anonymous: this.isAnonymous(),
            pasv_url: this.resolvePassiveModeIp,
        };

        this.resolvePassiveModeIp('10.13.37.42');

        if (config.ftp.pasv) {
            if (config.ftp.pasv.ip) {
                ftpConfig.pasv_url = config.ftp.pasv.ip;
            }
            if (config.ftp.pasv.portMin) {
                ftpConfig.pasv_min = config.ftp.pasv.portMin;
            }
            if (config.ftp.pasv.portMax) {
                ftpConfig.pasv_max = config.ftp.pasv.portMax;
            }
        }

        this.ftp = new FtpSrv(ftpConfig);
        this.ftp.on('login', this.onLogin.bind(this));
    }

    listen() {
        return this.ftp.listen().then(_ => logger.info('Server is running'));
    }

    isAnonymous() {
        return (!this.config.ftp.credentials || Object.keys(this.config.ftp.credentials).length === 0);
    }

    isLoginValid(username, password) {
        return this.config.ftp.credentials[username] && this.config.ftp.credentials[username] === password;
    }

    onLogin({connection, username, password}, resolve, reject) {
        logger.info({ip: connection.ip}, 'New connection');

        if (!this.isAnonymous() && !this.isLoginValid(username, password)) {
            return reject();
        }

        const memoryFileSystem = new MemoryFileSystem();

        connection.on('STOR', (error, filename) => {
            logger.info({filename}, 'Upload finished');

            const stream = memoryFileSystem.getUploaded(filename);
            if (stream) {
                this.telegramProxy.send(filename, stream);
                memoryFileSystem.removeUploaded(filename);
            }
        });

        return resolve({
            fs: memoryFileSystem
        });
    }

    resolvePassiveModeIp(address) {
        const nets = os.networkInterfaces();

        const result = Object
            .keys(nets)
            .map(key => nets[key])
            .reduce((carry, value) => carry.concat(value), [])
            .filter(net => isInSubnet.check(address, net.cidr));

        let ip = '127.0.0.1';
        if (result.length > 0) {
            ip = result[0].address;
        }

        logger.info({clientIp: address, serverIp: ip}, 'resolved PASV ip');
        return ip;
    }
}


module.exports = Ftp2Telegram;
