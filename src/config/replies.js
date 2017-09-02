/**
 * Messages that are used in replies on to Discord users who interact with the bot.
 */
module.exports = {
  general: {
    // reply
    unknownCommand: 'Hmmm. I couldn\'t find that command... did you mistype it?',
    // message | @user | help command
    mentionedMessage: 'Hey {}, you should try `{}` for a list of commands. :thumbsup:',
  },

  helpCommand: {
    // message | @user
    reply: 'Here you go {};',
  },

  summonCommand: {
    // reply | error message
    couldntConnect: 'I couldn\'t connect to your voice channel:\n```{}```',
    // reply
    notInVoiceChannel: 'You need to be in a voice channel to summon me!',
  },

  disconnectCommand: {
    // reply
    cantLeave: 'I can\'t disconnect if I\'m not connected...',
  },
};
