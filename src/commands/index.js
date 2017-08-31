// Music commands
const SUMMON_COMMAND = require('./music/summon.js');
const DISCONNECT_COMMAND = require('./music/disconnect.js');

// Utility commands
const HELP_COMMAND = require('./utility/help.js');

module.exports = [
  SUMMON_COMMAND,
  DISCONNECT_COMMAND,
  HELP_COMMAND,
];
