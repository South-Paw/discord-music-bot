const util = require('../../util/util.js');

const COMMAND_GROUP = 'nowPlayingCommand';

/**
 * Now Playing command.
 *
 * Replies with the currently playing song.
 *
 * @param {object} musicbot - The musicbot.
 * @param {object} msg      - The message object that called the command.
 * @param {array}  args     - List of arugments.
 */
const run = function run(musicbot, msg, args) { // eslint-disable-line
  if (musicbot.activeVoiceChannel == null || musicbot.activeVoiceConnection == null) {
    msg.reply(musicbot.getReplyMsg(COMMAND_GROUP, 'notConnectedToVoice'));
    return;
  }

  if (musicbot.nowPlaying) {
    musicbot.activeTextChannel.send({ embed: util.getNowPlayingEmbed(musicbot.nowPlaying) });
  } else {
    msg.reply(musicbot.getReplyMsg(COMMAND_GROUP, 'nothingPlaying'));
  }
};

const info = {
  name: 'Now Playing',
  aliases: ['nowplaying', 'np'],
  usage: 'nowplaying',
  description: 'Replies with the currently playing song.',
  permission: 'nowplaying',
};

module.exports = {
  info,
  run,
};
