const RichEmbed = require('discord.js').RichEmbed;

const commandIdentifer = require('../../util/constants.js').defaults.commandIdentifer;

/**
 * Help command.
 *
 * Creates a rich embed for each command, mentions the user who issued the command and then sends
 * the list of rich embeds back to the user.
 *
 * @param  {object} musicbot - The musicbot.
 * @param  {object} msg      - The message object that called the command.
 * @param  {array}  args     - List of arugments
 */
const run = function run(musicbot, msg, args) { // eslint-disable-line
  msg.channel.startTyping();

  const commandList = [];

  for (let i = 0; i < musicbot.commands.length; i += 1) {
    const command = musicbot.commands[i].info;

    commandList.push(new RichEmbed()
      .setAuthor(`${commandIdentifer}${command.name}`)
      .setDescription(`${command.description}\n\n**Usage:** \`${commandIdentifer}${command.usage}\``));
  }

  msg.channel.send(`Here you go ${msg.member.toString()};`);

  for (let i = 0; i < commandList.length; i += 1) {
    const embed = commandList[i];

    msg.channel.send({ embed });
  }

  msg.channel.stopTyping();
};

const info = {
  name: 'help',
  usage: 'help',
  description: 'Get a list of all available commands, each with a usage and description.',
};

module.exports = {
  info,
  run,
};
