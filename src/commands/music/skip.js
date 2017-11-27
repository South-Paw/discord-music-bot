const COMMAND_GROUP = 'skipCommand';

/**
 * Skip command.
 *
 * Skips the currently playing song.
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

  if (musicbot.isVoiceHandlerSet()) {
    msg.reply(musicbot.getReplyMsg(COMMAND_GROUP, 'skippingSong'));
    musicbot.voiceHandler.end();
  } else {
    msg.reply(musicbot.getReplyMsg(COMMAND_GROUP, 'nothingPlaying'));
  }
};

const info = {
  name: 'Skip',
  aliases: ['skip'],
  usage: 'skip',
  description: 'Skips the current song.',
  permission: 'skip',
};

module.exports = {
  info,
  run,
};
