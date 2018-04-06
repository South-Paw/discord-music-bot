const format = require('string-format');

const {
  BOT_MENTIONED,
} = require('../config/messages.js').constants;

const {
  COMMAND_PREFIX,
} = require('../config/preferences.js').constants;

const messageHandlers = {
  [BOT_MENTIONED]: (bot, message) => format(
    bot.getMessage(BOT_MENTIONED),
    message.member.user.toString(),
    bot.getPreference(COMMAND_PREFIX),
  ),
};

module.exports = messageHandlers;
