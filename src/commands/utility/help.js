const format = require('string-format');
const RichEmbed = require('discord.js').RichEmbed;

const commandGroup = 'helpCommand';

/**
 * Help command.
 *
 * Creates a rich embed for each command, mentions the user who issued the command and then sends
 * the list of rich embeds back to the user.
 *
 * @param {object} musicbot - The musicbot object.
 * @param {object} msg      - The message object that called the command.
 * @param {array}  args     - List of arugments
 */
const run = function run(musicbot, msg, args) { // eslint-disable-line
  const commandPrefix = musicbot.getSetting('commandPrefix');
  const commandList = [];

  for (let i = 0; i < musicbot.commands.length; i += 1) {
    const command = musicbot.commands[i].info;

    let commandAliases = '';

    for (let j = 0; j < command.aliases.length; j += 1) {
      commandAliases += `\`${commandPrefix}${command.aliases[j]}\` `;
    }

    let commandDescription = `${command.description}\n\n`;
    commandDescription += `**Usage:** \`${commandPrefix + command.usage}\`\n\n`;
    commandDescription += `**Aliases:** ${commandAliases}`;

    commandList.push(new RichEmbed()
      .setAuthor(`${commandPrefix}${command.name}`)
      .setDescription(commandDescription));
  }

  msg.channel.send(format(musicbot.getReplyMsg(commandGroup, 'reply'), msg.member.toString()));

  for (let i = 0; i < commandList.length; i += 1) {
    const embed = commandList[i];

    msg.channel.send({ embed });
  }
};

const info = {
  name: 'help',
  aliases: ['help', 'h'],
  usage: 'help',
  description: 'Get a list of all commands, with a usage and description for each.',
};

module.exports = {
  info,
  run,
};
