const run = (bot, args, message, commandDetails) => {
  console.log('help command run!', args);
  console.log(commandDetails);
};

module.exports = {
  key: 'help_command',
  aliases: ['help', 'h'],
  details: {
    name: 'Help',
    usage: 'help [command alias]',
    description: "Provides a list of all commands or a single command, with it's usage and description.",
  },
  run,
};
