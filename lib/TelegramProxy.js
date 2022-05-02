const TeleBot = require('telebot');
const mime = require('mime/lite');

class TelegramProxy {

    constructor(config) {
        this.bot = new TeleBot(config.token);
        this.bot.start();

        this.config = config;
    }

    send(filename, stream) {
        console.log("telegram.send", filename);
        const buffer = stream.toBuffer();
        const mimeType = mime.getType(filename);

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
