const COMMAND_GROUP = 'setAvatarCommand';

/**
 * Set avatar command.
 *
 * Sets the bot's avatar image.
 *
 * @param {object} musicbot - The musicbot.
 * @param {object} msg      - The message object that called the command.
 * @param {array}  args     - List of arugments.
 */
const run = function run(musicbot, msg, args) {
  const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;

  if (args[0] && args[0].match(urlRegex)) {
    musicbot.bot.user.setAvatar(args[0])
      .then(() => msg.reply(musicbot.getReplyMsg(COMMAND_GROUP, 'success')))
      .catch(error => msg.reply(`${musicbot.getReplyMsg(COMMAND_GROUP, 'error')}:\n\`\`\`${error}\`\`\``));
  } else {
    msg.reply(musicbot.getReplyMsg(COMMAND_GROUP, 'invalidUrl'));
  }
};

const info = {
  name: 'Set Avatar',
  aliases: ['setavatar'],
  usage: 'setavatar <image url>',
  description: 'Set the bot\'s avatar to the given url (overrides the previous image).',
  permission: 'setavatar',
};

module.exports = {
  info,
  run,
};
