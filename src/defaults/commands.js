const { HelpCommand, info: helpInfo } = require('../commands/util/help');
const { SetAvatarCommand, info: setAvatarInfo } = require('../commands/util/setAvatar');
const { SetUsernameCommand, info: setUsernameInfo } = require('../commands/util/setUsername');

const defaultCommands = {
  [helpInfo.key]: HelpCommand,
  [setAvatarInfo.key]: SetAvatarCommand,
  [setUsernameInfo.key]: SetUsernameCommand,
};

const defaultCommandDetails = {
  [helpInfo.key]: helpInfo,
  [setAvatarInfo.key]: setAvatarInfo,
  [setUsernameInfo.key]: setUsernameInfo,
};

module.exports = { defaultCommands, defaultCommandDetails };
