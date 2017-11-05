// Music commands
const SUMMON_COMMAND = require('./music/summon.js');
const DISCONNECT_COMMAND = require('./music/disconnect.js');
const PLAY_COMMAND = require('./music/play.js');

// Utility commands
const HELP_COMMAND = require('./utility/help.js');
const SET_USERNAME_COMMAND = require('./utility/setusername.js');
const SET_AVATAR_COMMAND = require('./utility/setavatar.js');

module.exports = [
  SUMMON_COMMAND,
  DISCONNECT_COMMAND,
  PLAY_COMMAND,
  HELP_COMMAND,
  SET_USERNAME_COMMAND,
  SET_AVATAR_COMMAND,
];
