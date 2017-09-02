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
    // reply | help command
    unknown: 'I can\'t see a command or alias for that one... why don\'t you try `{}`?',
  },

  summonCommand: {
    // reply + error
    couldntConnect: 'I couldn\'t connect to your voice channel',
    // reply
    notInVoiceChannel: 'You need to be in a voice channel to summon me!',
  },

  disconnectCommand: {
    // reply
    cantLeave: 'I can\'t disconnect if I\'m not connected...',
  },

  setAvatarCommand: {
    // reply
    success: ':ok_hand: Avatar successfully set!',
    // reply + error
    error: 'Unable to set avatar',
    // reply
    invalidUrl: 'Are you sure that\'s a valid URL..?',
  },

  setUsernameCommand: {
    // reply
    success: ':ok_hand: Username successfully set!',
    // reply + error
    error: 'Unable to set username',
    // reply
    invalidUsername: 'Uhh... that doesn\'t seem to be something I could name myself...',
  },
};
