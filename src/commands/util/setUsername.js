/* eslint-disable no-unused-vars */

const run = (bot, args, message) => {
  console.log('set username command run!', args);
};

module.exports = {
  key: 'setUsername_command',
  aliases: ['setusername'],
  details: {
    name: 'Set Username',
    usage: 'setusername <new username>',
    description: "Set the bot's username.",
  },
  run,
};
