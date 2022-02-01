require('dotenv').config();

const { TwitterBot } = require('./twitter-bot');

const PORT = process.env.PORT || 3000;

const bot = new TwitterBot({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_KEY_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    triggerWord: process.env.TRIGGER
});

exports.handler = async function() {
    console.log(`execute @ ${new Date().toTimeString()}`);
    let tempMessage = {};
    try {
        const authenticatedUserId = await bot.getAdminUserInfo();
        const message = await bot.getDirectMessage(authenticatedUserId);
        if (message.id) {
            tempMessage = message;
            const { data } = await bot.tweetMessage(message);
            const response = await bot.deleteMessage(message);
            console.log(`... DM has been successfuly reposted with id: ${data.id} @ ${data.created_at}`);
        } else {
            console.log('no tweet to post');
        };
    } catch (error) {
        console.log(error, 'ERROR.');
        if (tempMessage.id) {
            await bot.deleteMessage(tempMessage);
        };
    };
};