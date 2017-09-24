const commandGroup = 'disconnectCommand';

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
  if (musicbot.activeVoiceChannel != null) {
    musicbot.activeVoiceChannel.leave();
    musicbot.setActiveVoiceConnection(null, null);
  } else {
    /**
     * There is an edge case in disconnections that I've observed in other bots and have attempted
     * to fix here - however it doesn't seem that this code manages to achieve it. See issue #1.
     */
    const thisServer = musicbot.bot.guilds.get(musicbot.serverId);

    if (thisServer == null) {
      throw new Error();
    }

    const currentVoiceChannel = thisServer.me.voiceChannel;

    if (currentVoiceChannel != null) {
      currentVoiceChannel.leave();
    } else {
      msg.reply(musicbot.getReplyMsg(commandGroup, 'cantLeave'));
    }
  }
};

const info = {
  name: 'Disconnect',
  aliases: ['disconnect', 'd'],
  usage: 'disconnect',
  description: 'Disconnects the bot from it\'s current voice channel.',
  permission: 'disconnect',
};

module.exports = {
  info,
  run,
};
