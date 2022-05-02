const config = require('./config/production');
const TelegramProxy = require('./lib/TelegramProxy');
const MemoryFileSystem = require('./lib/MemoryFileSystem');

const FtpSrv = require('ftp-srv');

const telegramProxy = new TelegramProxy(config.telegram);

const anonymous = (Object.keys(config.ftp.credentials).length === 0);
const ftpServer = new FtpSrv({
    url: config.ftp.url,
    pasv_url: config.ftp.pasv.ip,
    pasv_min: config.ftp.pasv.portMin,
    pasv_max: config.ftp.pasv.portMax,
    anonymous: anonymous,
});

ftpServer.on('login', ({connection, username, password}, resolve, reject) => {
    console.log("ftp.login", username, password);

    if (!anonymous) {
        if (!config.ftp.credentials[username] || config.ftp.credentials[username] !== password) {
            return reject();
        }
    }

    const memoryFileSystem = new MemoryFileSystem();

    connection.on('STOR', (error, filename) => {
        console.log("ftp.STOR", error, filename);
        const stream = memoryFileSystem.getUploaded(filename);

        if (stream) {
            console.log("stream", filename);
            telegramProxy.send(filename, stream);
            memoryFileSystem.removeUploaded(filename);
        }
    });

    return resolve({
        fs: memoryFileSystem
    });
});

ftpServer
    .listen()
    .then(_ => console.log('Server is running'));
