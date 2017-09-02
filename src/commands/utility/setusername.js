const commandGroup = 'setUsernameCommand';

/**
 * Set username command.
 *
 * Sets the bot's username.
 *
 * @param {object} musicbot - The musicbot.
 * @param {object} msg      - The message object that called the command.
 * @param {array}  args     - List of arugments
 */
const run = function run(musicbot, msg, args) {
  if (args != null && args.length >= 1) {
    musicbot.bot.user.setUsername(args.join(' '))
      .then(() => msg.reply(musicbot.getReplyMsg(commandGroup, 'success')))
      .catch((error) => {
        msg.reply(`${musicbot.getReplyMsg(commandGroup, 'error')}:\n\`\`\`${error}\`\`\``);
      });
  } else {
    msg.reply(musicbot.getReplyMsg(commandGroup, 'invalidUsername'));
  }
};

const info = {
  name: 'Set Username',
  aliases: ['setusername'],
  usage: 'setusername <new username>',
  description: 'Set the bot\'s username.',
};

module.exports = {
  info,
  run,
};
