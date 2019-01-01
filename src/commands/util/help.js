const Command = require('../Command');
const { DIRECT_MESSAGE } = require('../../constants');

const MAX_ITEMS_PER_MESSAGE = 10;

class HelpCommand extends Command {
  getSingleDetailBlock(commandDetails) {
    const prefix = this.bot.settings.preferences.COMMAND_PREFIX;
    const commandAliases = commandDetails.aliases.map(alias => `${prefix}${alias}`);

    let message = '```\n';
    message += `${commandDetails.details.name} Command\n\n`;
    message += `${commandDetails.details.description}\n\n`;
    message += `Usage:   ${prefix + commandDetails.details.usage}\n`;
    message += `Aliases: ${commandAliases.join(', ')}`;
    message += '```';

    return message;
  }

  run() {
    this.bot.messageHandler(DIRECT_MESSAGE, 'HELP_COMMAND_WELCOME_DM', this.message);

    let detailStrings = [];

    Object.keys(this.bot.settings.commandDetails).forEach(key => {
      if (detailStrings.length === MAX_ITEMS_PER_MESSAGE) {
        this.bot.messageHandler(DIRECT_MESSAGE, 'HELP_COMMAND_DM', this.message, detailStrings);
        detailStrings = [];
      }

      detailStrings.push(this.getSingleDetailBlock(this.bot.settings.commandDetails[key]));
    });

    if (detailStrings.length > 0) {
      this.bot.messageHandler(DIRECT_MESSAGE, 'HELP_COMMAND_DM', this.message, detailStrings);
    }
  }
}

const info = {
  key: 'help_command',
  aliases: ['help', 'h'],
  details: {
    name: 'Help',
    usage: 'help',
    description: "Direct messages you with a list of all the bot's commands that you have permission to use.",
  },
};

module.exports = { HelpCommand, info };
