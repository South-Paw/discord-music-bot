const { HelpCommand, info: helpInfo } = require('../commands/util/help');
const { SetAvatarCommand, info: setAvatarInfo } = require('../commands/util/setAvatar');
const { SetUsernameCommand, info: setUsernameInfo } = require('../commands/util/setUsername');
const { JoinCommand, info: joinInfo } = require('../commands/util/join');
const { LeaveCommand, info: leaveInfo } = require('../commands/util/leave');

const defaultCommands = {
  [helpInfo.key]: HelpCommand,
  [setAvatarInfo.key]: SetAvatarCommand,
  [setUsernameInfo.key]: SetUsernameCommand,
  [joinInfo.key]: JoinCommand,
  [leaveInfo.key]: LeaveCommand,
};

const defaultCommandDetails = {
  [helpInfo.key]: helpInfo,
  [setAvatarInfo.key]: setAvatarInfo,
  [setUsernameInfo.key]: setUsernameInfo,
  [joinInfo.key]: joinInfo,
  [leaveInfo.key]: leaveInfo,
};

module.exports = { defaultCommands, defaultCommandDetails };
