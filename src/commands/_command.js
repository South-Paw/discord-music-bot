/**
 * <name> command.
 *
 * <description>
 *
 * @param {object} musicbot - The musicbot.
 * @param {object} msg      - The message object that called the command.
 * @param {array}  args     - List of arugments.
 */
const run = function run(musicbot, msg, args) { // eslint-disable-line
  // command code here ...
};

const info = {
  name: 'command-name',
  aliases: ['multiple', 'command', 'aliases'],
  usage: 'command-name <req1> <req2> [opt1 [opt2]]',
  description: 'human readable command description',
  permission: 'commandPermission',
};

module.exports = {
  info,
  run,
};
