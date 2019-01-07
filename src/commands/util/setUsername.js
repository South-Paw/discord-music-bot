const Command = require('../Command');
const { REPLY } = require('../../constants');

class SetUsernameCommand extends Command {
  run() {
    if (this.args.length >= 1) {
      this.bot.client.user
        .setUsername(this.args.join(' '))
        .then(() => this.bot.messageHandler(REPLY, 'SET_USERNAME_COMMAND_SUCCESS', this.message))
        .catch(error => this.bot.messageHandler(REPLY, 'SET_USERNAME_COMMAND_ERROR', this.message, error));

      return;
    }

    this.bot.messageHandler(REPLY, 'SET_USERNAME_COMMAND_INVALID_NAME', this.message);
  }
}

const info = {
  key: 'setUsername_command',
  aliases: ['setusername'],
  details: {
    name: 'Set Username',
    usage: 'setusername <new username>',
    description: "Sets the bot's username.",
  },
};

module.exports = { SetUsernameCommand, info };
