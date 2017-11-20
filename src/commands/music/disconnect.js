const COMMAND_GROUP = 'disconnectCommand';

/**
 * Disconnect command.
 *
 * Disconnects the music bot from it's current voice channel.
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

  musicbot.activeVoiceChannel.leave();
  musicbot.resetBotState();
};

const info = {
  name: 'Disconnect',
  aliases: ['disconnect', 'd', 'leave'],
  usage: 'disconnect',
  description: 'Disconnects the bot from it\'s current voice channel.',
  permission: 'disconnect',
};

module.exports = {
  info,
  run,
};
