/* eslint-disable no-unused-vars */

const format = require('string-format');

const { BOT_MENTIONED, UNKNOWN_COMMAND } = require('../config/messages').messageConstants;
const { COMMAND_PREFIX } = require('../config/preferences').preferenceConstants;

const messageHandlers = {
  [BOT_MENTIONED]: (bot, message) =>
    format(bot.getMessage(BOT_MENTIONED), message.member.user.toString(), bot.getPreference(COMMAND_PREFIX)),
  [UNKNOWN_COMMAND]: (bot, message) => bot.getMessage(UNKNOWN_COMMAND),
};

module.exports = messageHandlers;
