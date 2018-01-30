// Music commands
const SUMMON_COMMAND = require('./music/summon.js');
const DISCONNECT_COMMAND = require('./music/disconnect.js');
const PLAY_COMMAND = require('./music/play.js');
const PAUSE_COMMAND = require('./music/pause.js');
const RESUME_COMMAND = require('./music/resume.js');
const STOP_COMMAND = require('./music/stop.js');
const SKIP_COMMAND = require('./music/skip.js');
const NOW_PLAYING_COMMAND = require('./music/nowplaying.js');
const PLAYLIST_COMMAND = require('./music/playlist.js');

// Utility commands
const HELP_COMMAND = require('./utility/help.js');
const SET_USERNAME_COMMAND = require('./utility/setusername.js');
const SET_AVATAR_COMMAND = require('./utility/setavatar.js');

// Note: The export order here matters as it defines the command search order and the display of
// the !help command.
module.exports = [
  // Music commands
  SUMMON_COMMAND,
  DISCONNECT_COMMAND,
  PLAY_COMMAND,
  PAUSE_COMMAND,
  RESUME_COMMAND,
  STOP_COMMAND,
  SKIP_COMMAND,
  NOW_PLAYING_COMMAND,
  PLAYLIST_COMMAND,
  // Utility commands
  HELP_COMMAND,
  SET_USERNAME_COMMAND,
  SET_AVATAR_COMMAND,
];
