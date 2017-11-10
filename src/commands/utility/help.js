const format = require('string-format');
const { RichEmbed } = require('discord.js');

const COMMAND_GROUP = 'helpCommand';

// TODO user who called, check perms and give their commands instead of just all commands

/**
 * Turns a info object into a RichEmbed. Only used for single commands.
 *
 * @param  {string} preifx - The bots command prefix.
 * @param  {object} info   - The info object from a command.
 * @return {RichEmbed}     - A discord.js RichEmbed containing the info object.
 */
function infoToEmbed(preifx, info) {
  let commandAliases = '';

  for (let j = 0; j < info.aliases.length; j += 1) {
    commandAliases += `\`${preifx}${info.aliases[j]}\` `;
  }

  let commandDescription = `${info.description}\n\n`;
  commandDescription += `**Usage:** \`${preifx + info.usage}\`\n\n`;
  commandDescription += `**Aliases:** ${commandAliases}`;

  return new RichEmbed()
    .setAuthor(`${info.name}`)
    .setDescription(commandDescription);
}

/**
 * Turns a info object into a code block.
 *
 * @param  {string} preifx - The bots command prefix.
 * @param  {object} info   - The info object from a command.
 * @return {string}        - A code block containing the info object.
 */
function infoToText(preifx, info) {
  let commandAliases = '';

  for (let j = 0; j < info.aliases.length; j += 1) {
    commandAliases += `${preifx}${info.aliases[j]} `;
  }

  let infoBlock = '';
  infoBlock += '```\n';
  infoBlock += `${info.name} - ${info.description}\n\n`;
  infoBlock += `Usage:   ${preifx + info.usage}\n`;
  infoBlock += `Aliases: ${commandAliases}`;
  infoBlock += '```\n';

  return infoBlock;
}

/**
 * Help command.
 *
 * Creates a rich embed for each command, mentions the user who issued the command and then sends
 * the list of rich embeds back to the user.
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
      const embed = infoToEmbed(commandPrefix, command.info);

      msg.reply({ embed });
    }
  } else {
    let helpText = '';

    for (let i = 0; i < musicbot.commands.length; i += 1) {
      helpText += infoToText(commandPrefix, musicbot.commands[i].info);
    }

    msg.reply(`${helpText}`);
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
  // exposed for testing only
  infoToEmbed,
};
