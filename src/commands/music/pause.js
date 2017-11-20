const COMMAND_GROUP = 'pauseCommand';

/**
 * Pause command.
 *
 * Pauses any currently playing song.
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

  if (msg.member.voiceChannel !== musicbot.activeVoiceChannel) {
    msg.reply(musicbot.getReplyMsg(COMMAND_GROUP, 'notInSendersChannel'));
    return;
  }

  if (musicbot.isVoiceHandlerSet() && !musicbot.isPlaybackPaused()) {
    musicbot.voiceHandler.pause();
    musicbot.setPlaybackPaused(true);
    musicbot.setBotNowPlaying(`${musicbot.nowPlaying.title} (Paused)`);
    msg.reply('Pausing!');
  } else {
    msg.reply(musicbot.getReplyMsg(COMMAND_GROUP, 'notPlaying'));
  }
};

const info = {
  name: 'Pause',
  aliases: ['pause'],
  usage: 'pause',
  description: 'Pauses any currently playing song.',
  permission: 'pause',
};

module.exports = {
  info,
  run,
};
