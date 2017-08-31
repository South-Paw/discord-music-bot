/**
 * Disconnect command.
 *
 * Disconnects the music bot from it's current voice channel.
 *
 * @param {object} musicbot - The musicbot.
 * @param {object} msg      - The message object that called the command.
 * @param {array}  args     - List of arugments
 */
const run = function run(musicbot, msg, args) { // eslint-disable-line
  if (musicbot.activeVoiceChannel != null) {
    musicbot.activeVoiceChannel.leave();
    musicbot.setActiveVoiceConnection(null, null);
  } else {
    /*
      FIXME:
      There is a possible issue here... this code is supposed to be for if the bot disconnects and
      reconnects or is restarted but it has not left or been kicked from a channel in Discord...
      so it has no memory of what voice channel it was in so it can leave it upon reconnecting.

      The idea is/was to get the bot's user, get the voice channel and then .leave() it - but this
      doesn't seem to work at all...
     */
    const thisServer = musicbot.bot.guilds.get(musicbot.serverId);

    if (thisServer == null) {
      throw new Error();
    }

    const currentVoiceChannel = thisServer.me.voiceChannel;

    if (currentVoiceChannel != null) {
      currentVoiceChannel.leave();
    } else {
      msg.reply('I can\'t disconnect if I\'m not connected...');
    }
  }
};

const info = {
  name: 'disconnect',
  aliases: ['disconnect', 'd'],
  usage: 'disconnect',
  description: 'Disconnects the bot from it\'s current voice channel.',
};

module.exports = {
  info,
  run,
};
