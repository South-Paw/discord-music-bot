const commandGroup = 'setAvatarCommand';

/**
 * Set avatar command.
 *
 * Sets the bot's avatar image.
 *
 * @param {object} musicbot - The musicbot.
 * @param {object} msg      - The message object that called the command.
 * @param {array}  args     - List of arugments
 */
const run = function run(musicbot, msg, args) {
  const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;

  if (args[0].match(urlRegex)) {
    musicbot.bot.user.setAvatar(args[0])
      .then(() => msg.reply(musicbot.getReplyMsg(commandGroup, 'success')))
      .catch((error) => {
        msg.reply(`${musicbot.getReplyMsg(commandGroup, 'error')}:\n\`\`\`${error}\`\`\``);
        // TODO: requires logging when requests fail
      });
  } else {
    msg.reply(musicbot.getReplyMsg(commandGroup, 'invalidUrl'));
  }
};

const info = {
  name: 'setavatar',
  aliases: ['setavatar'],
  usage: 'setavatar <image url>',
  description: 'Set the bot\'s avatar to the given url (overrides the previous image).',
};

module.exports = {
  info,
  run,
};
