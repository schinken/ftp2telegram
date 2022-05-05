const Ftp2Telegram = require('./lib/Ftp2telegram');
const config = require('./config/production');

const ftp2telegram = new Ftp2Telegram(config);
ftp2telegram.listen();
