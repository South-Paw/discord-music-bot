// Music commands
const SUMMON_COMMAND = require('./music/summon.js');
const DISCONNECT_COMMAND = require('./music/disconnect.js');
const PLAY_COMMAND = require('./music/play.js');
const PAUSE_COMMAND = require('./music/pause.js');
const RESUME_COMMAND = require('./music/resume.js');
const STOP_COMMAND = require('./music/stop.js');

// Utility commands
const HELP_COMMAND = require('./utility/help.js');
const SET_USERNAME_COMMAND = require('./utility/setusername.js');
const SET_AVATAR_COMMAND = require('./utility/setavatar.js');

module.exports = [
  SUMMON_COMMAND,
  DISCONNECT_COMMAND,
  PLAY_COMMAND,
  PAUSE_COMMAND,
  RESUME_COMMAND,
  STOP_COMMAND,
  HELP_COMMAND,
  SET_USERNAME_COMMAND,
  SET_AVATAR_COMMAND,
];
