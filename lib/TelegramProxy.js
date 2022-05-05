const TeleBot = require('telebot');
const MagicBytes = require('magic-bytes.js');
const logger = require('./Logger');

class TelegramProxy {

    constructor(config) {
        this.bot = new TeleBot(config.token);
        this.bot.start();

        this.config = config;
    }

    async send(filename, stream) {
        const buffer = stream.toBuffer();
        let mimeType = null;

        const mimeTypes = MagicBytes.filetypemime(buffer);
        if (mimeTypes.length > 0) {
            mimeType = mimeTypes[0];
        } else {
            return logger.error({filename}, "Can't determine Mime-Type");
        }

        const options = {
            fileName: filename
        };

        logger.info({filename, mimeType}, 'Sending to telegram');

        this.config.chatIds.forEach(chatId => {
            if (mimeType.match(/image\/gif/)) {
                this.bot.sendAnimation(chatId, buffer, options);
            } else if (mimeType.match(/^image\//)) {
                this.bot.sendPhoto(chatId, buffer, options);
            } else if (mimeType.match(/^video\//)) {
                this.bot.sendVideo(chatId, buffer, options);
            } else if (mimeType.match(/^audio\//)) {
                this.bot.sendAudio(chatId, buffer, options);
            } else if (mimeType === 'application/pdf') {
                this.bot.sendDocument(chatId, buffer, options);
            }
        });
    }
}


module.exports = TelegramProxy;
