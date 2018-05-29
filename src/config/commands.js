const HELP_COMMAND = require('../commands/util/help');
const SET_AVATAR_COMMAND = require('../commands/util/setAvatar');
const SET_USERNAME_COMMAND = require('../commands/util/setUsername');

const commandKeys = {
  HELP_COMMAND: HELP_COMMAND.key,
  SET_AVATAR_COMMAND: SET_AVATAR_COMMAND.key,
  SET_USERNAME_COMMAND: SET_USERNAME_COMMAND.key,
};

const commandAliases = {
  [HELP_COMMAND.key]: HELP_COMMAND.aliases,
  [SET_AVATAR_COMMAND.key]: SET_AVATAR_COMMAND.aliases,
  [SET_USERNAME_COMMAND.key]: SET_USERNAME_COMMAND.aliases,
};

const commandDetails = {
  [HELP_COMMAND.key]: HELP_COMMAND.details,
  [SET_AVATAR_COMMAND.key]: SET_AVATAR_COMMAND.details,
  [SET_USERNAME_COMMAND.key]: SET_USERNAME_COMMAND.details,
};

module.exports = {
  commandKeys,
  commandAliases,
  commandDetails,
};
