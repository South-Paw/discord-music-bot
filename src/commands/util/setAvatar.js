const run = (bot, args, message) => {
  console.log('set avatar command run!', args);
};

module.exports = {
  key: 'setAvatar_command',
  aliases: ['setavatar'],
  details: {
    name: 'Set Avatar',
    usage: 'setavatar <image url>',
    description: "Set the bot's avatar image to the given url (overrides the previous image).",
  },
  run,
};
