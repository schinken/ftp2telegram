const TeleBot = require('telebot');
const MagicBytes = require('magic-bytes.js');

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
        }

        const options = {
            fileName: filename
        };

        this.config.chatIds.forEach(chatId => {
            if (mimeType === null) {
                console.error('Cannot determine mimetype for file');
            } else if (mimeType.match(/image\/gif/)) {
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
