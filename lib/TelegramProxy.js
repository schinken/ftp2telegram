const TeleBot = require('telebot');
const FileType = require('file-type');

class TelegramProxy {

    constructor(config) {
        this.bot = new TeleBot(config.token);
        this.bot.start();

        this.config = config;
    }

    async send(filename, stream) {
        const buffer = stream.toBuffer();
        const {mime: mimeType} = await FileType.fromBuffer(buffer);

        const options = {
            fileName: filename
        };

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
