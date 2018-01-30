const format = require('string-format');
const { RichEmbed } = require('discord.js');

const COMMAND_GROUP = 'helpCommand';

/**
 * Turns a info object into a RichEmbed. Only used for single commands.
 *
 * @param  {string} preifx  - The bots command prefix.
 * @param  {object} command - The info object from a command.
 * @return {RichEmbed}      - A discord.js RichEmbed containing the info object.
 */
function infoToEmbed(preifx, command) {
  let commandAliases = '';

  command.aliases.forEach((alias) => {
    commandAliases += `\`${preifx}${alias}\` `;
  });

  let commandDescription = `${command.description}\n\n`;
  commandDescription += `**Usage:** \`${preifx + command.usage}\`\n\n`;
  commandDescription += `**Aliases:** ${commandAliases}`;

  return new RichEmbed()
    .setAuthor(`${command.name}`)
    .setDescription(commandDescription);
}

/**
 * Turns a list of info objects into string of code blocks.
 *
 * @param  {string} preifx       - The bots command prefix.
 * @param  {array}  messageItems - A list of info objects from a command.
 * @return {string}              - A string containing the info objects.
 */
function itemsToHelpBlock(preifx, messageItems) {
  let message = '';

  messageItems.forEach(({ info: command }) => {
    let commandAliases = '';

    command.aliases.forEach((alias) => {
      commandAliases += `${preifx}${alias} `;
    });

    message += '```\n';
    message += `${command.name} - ${command.description}\n\n`;
    message += `Usage:   ${preifx + command.usage}\n`;
    message += `Aliases: ${commandAliases}`;
    message += '```';
  });

  return message;
}

/**
 * Help command.
 *
 * Creates a rich embed for each command, mentions the user who issued the command and then sends
 * the list of rich embeds back to the user.
 *
 * TODO: user who called command, check if they have perms and give their group's commands instead
 * of just all commands?
 *
 * @param {object} musicbot - The musicbot object.
 * @param {object} msg      - The message object that called the command.
 * @param {array}  args     - List of arugments.
 */
const run = function run(musicbot, msg, args) { // eslint-disable-line
  const commandPrefix = musicbot.getSetting('commandPrefix');

  if (args.length >= 1) {
    const command = musicbot.findCommand(args[0]);

    if (!command) {
      msg.reply(format(musicbot.getReplyMsg(COMMAND_GROUP, 'unknown'), `${commandPrefix}help`));
    } else {
      msg.reply({ embed: infoToEmbed(commandPrefix, command.info) });
    }
  } else {
    const maxItemsInMessage = 15;
    let messageItems = [];

    msg.reply(musicbot.getReplyMsg(COMMAND_GROUP, 'hereYouAre'));

    musicbot.commands.forEach((item) => {
      if (maxItemsInMessage === messageItems.length) {
        musicbot.activeTextChannel.send(itemsToHelpBlock(commandPrefix, messageItems));

        messageItems = [];
      }

      messageItems.push(item);
    });

    if (messageItems.length > 0) {
      musicbot.activeTextChannel.send(itemsToHelpBlock(commandPrefix, messageItems));
    }
  }
};

const info = {
  name: 'Help',
  aliases: ['help', 'h'],
  usage: 'help [command alias]',
  description: 'Get a list of all commands or a single command, with it\'s usage and description.',
  permission: 'help',
};

module.exports = {
  info,
  run,
  // Exposed for testing only.
  infoToEmbed,
};
