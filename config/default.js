module.exports = {
    ftp: {
        url: 'ftp://0.0.0.0:21',

        /* Optional! Only needed if you want to specify the pasv ip yourself
        pasv: {
            ip: '192.168.1.2',
            portMin: 21000,
            portMax: 21010,
        },
        */
        credentials: {
            'username': 'password'
        }
    },

    telegram: {
        token: 'xxxxxxxxxxxxxxxxxxxxxxxxx',
        chatIds: [-1337]
    }
};
