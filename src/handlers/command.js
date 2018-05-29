const { commandKeys, commandDetails } = require('../config/commands');

const { HELP_COMMAND, SET_AVATAR_COMMAND, SET_USERNAME_COMMAND } = commandKeys;

const { run: helpCommand } = require('../commands/util/help');
const { run: setAvatarCommand } = require('../commands/util/setAvatar');
const { run: setUsernameCommand } = require('../commands/util/setUsername');

const commandHandlers = {
  [HELP_COMMAND]: (bot, args, message) => helpCommand(bot, args, message, commandDetails),
  [SET_AVATAR_COMMAND]: (bot, args, message) => setAvatarCommand(bot, args, message),
  [SET_USERNAME_COMMAND]: (bot, args, message) => setUsernameCommand(bot, args, message),
};

module.exports = commandHandlers;
