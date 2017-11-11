const COMMAND_GROUP = 'pauseCommand';

/**
 * Stop command.
 *
 * Stops the current playlist and skips the current song.
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

  if (musicbot.isPlaybackStopped()) {
    msg.reply(musicbot.getReplyMsg(COMMAND_GROUP, 'alreadyStopped'));
  } else {
    musicbot.setPlaybackStopped(true);
    if (musicbot.voiceHandler !== null) {
      musicbot.voiceHandler.end();
    }
    musicbot.setBotNowPlaying(null);
    msg.reply('Stopping!');
  }
};

const info = {
  name: 'Stop',
  aliases: ['stop'],
  usage: 'stop',
  description: 'Stops the current playlist and skips the current song.',
  permission: 'stop',
};

module.exports = {
  info,
  run,
};
