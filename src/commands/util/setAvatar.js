const Command = require('../Command');
const { REPLY } = require('../../constants');

const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;

class SetAvatarCommand extends Command {
  run() {
    if (this.args[0] && this.args[0].match(urlRegex)) {
      this.bot.client.user
        .setAvatar(this.args[0])
        .then(() => this.bot.messageHandler(REPLY, 'SET_AVATAR_COMMAND_SUCCESS', this.message))
        .catch(error => this.bot.messageHandler(REPLY, 'SET_AVATAR_COMMAND_ERROR', this.message, error));

      return;
    }

    this.bot.messageHandler(REPLY, 'SET_AVATAR_COMMAND_INVALID_URL', this.message);
  }
}

const info = {
  key: 'setAvatar_command',
  aliases: ['setavatar'],
  details: {
    name: 'Set Avatar',
    usage: 'setavatar <image url>',
    description: "Set the bot's avatar image to the given url (overrides the previous image).",
  },
};

module.exports = { SetAvatarCommand, info };
