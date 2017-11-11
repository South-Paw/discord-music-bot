/**
 * Messages that are used in replies on to Discord users who interact with the bot.
 */
module.exports = {
  general: {
    // reply
    unknownCommand: 'Hmmm. I couldn\'t find that command... did you mistype it?',
    // reply
    noPermission: 'It would seem that you don\'t have permission for that command. :fearful:',
    // message | @user | help command
    mentionedMessage: 'Hey {}, you should try `{}` for a list of commands. :thumbsup:',
    // message
    queueEmpty: 'Looks like your playlist is empty. :sob:',
    // reply | video title
    youtubeVideoAdded: 'Added **{}** to the queue.',
  },

  disconnectCommand: {
    // reply
    notConnectedToVoice: 'I can\'t disconnect if I\'m not connected...',
    // reply
    notInSendersChannel: 'You should really be listening to me before trying to do that :thinking:',
  },

  pauseCommand: {
    // reply
    notPlaying: 'I can\'t pause when I\'m not playing :thinking:',
    // reply
    notConnectedToVoice: 'I can\'t pause anything when I\'m not connected to a voice channel!',
    // reply
    notInSendersChannel: 'You should really be listening to me before trying to pause anything :neutral_face:',
  },

  playCommand: {
    // reply | help command
    unknownPlayUrl: 'I either don\'t support or couldn\'t understand that URL.',
    // reply
    notConnectedToVoice: 'I can\'t play anything when I\'m not connected to a voice channel!',
    // reply
    notInSendersChannel: 'You need to summon me to your channel first!',
  },

  resumeCommand: {
    // reply
    notConnectedToVoice: 'I can\'t play anything when I\'m not connected to a voice channel!',
    // reply
    notInSendersChannel: 'You should really be listening to me before trying to resume anything :neutral_face:',
    // reply
    alreadyPlaying: 'I\'m already playing though! :wink:',
  },

  stopCommand: {
    // reply
    notConnectedToVoice: 'I can\'t stop anything when I\'m not even connected to a voice channel!',
    // reply
    notInSendersChannel: 'You should really be in my channel before trying to stop anything :neutral_face:',
    // reply
    alreadyStopped: 'But I\'ve already stopped playing... :sweat:',
  },

  summonCommand: {
    // reply + error
    couldntConnect: 'I couldn\'t connect to your voice channel',
    // reply
    notInVoiceChannel: 'You need to be in a voice channel to summon me!',
  },

  helpCommand: {
    // reply | help command
    unknown: 'I can\'t see a command or alias for that one... why don\'t you try `{}`?',
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
