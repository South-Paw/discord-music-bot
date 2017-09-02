const format = require('string-format');

const commandGroup = 'summonCommand';

/**
 * Summon command.
 *
 * Summons the music bot to the users voice channel.
 *
 * @param {object} musicbot - The musicbot.
 * @param {object} msg      - The message object that called the command.
 * @param {array}  args     - List of arugments
 */
const run = function run(musicbot, msg, args) { // eslint-disable-line
  const callersChannel = msg.member.voiceChannel;

  if (msg.member.voiceChannel != null) {
    callersChannel.join()
      .then(connection => musicbot.setActiveVoiceConnection(callersChannel, connection))
      .catch(error => msg.reply(`${musicbot.getReplyMsg(commandGroup, 'couldntConnect')}:\n\`\`\`${error.message}\`\`\``));
  } else {
    msg.reply(musicbot.getReplyMsg(commandGroup, 'notInVoiceChannel'));
  }
};

const info = {
  name: 'Summon',
  aliases: ['summon', 's'],
  usage: 'summon',
  description: 'Summons the bot to your current voice channel.',
};

module.exports = {
  info,
  run,
};
