/**
 * Messages that are used in replies on to Discord users who interact with the bot.
 */
const reply = {
  // reply
  unknownCommand: 'Hmmm. I couldn\'t find that command... did you mistype it?',
  // reply | @user | help command
  mentionedMessage: 'Hey {}, you should try `{}` for a list of commands. :thumbsup:',
  // message | @user
  helpCommandReply: 'Here you go {};',
  // reply | error message
  summonCommandCouldntConnect: 'I couldn\'t connect to your voice channel:\n```{}```',
  // reply
  summonCommandNotInVoice: 'You need to be in a voice channel to summon me!',
  // reply
  disconnectCommandCantLeave: 'I can\'t disconnect if I\'m not connected...',
};

/**
 * Messages that are used in server logging of the bot actions.
 */
const log = {
  //
  configMissing: 'You\'re missing some very important things! Check that your `token`, `serverId` and `textChannelId` are set in the config!',
  // 
  connected: 'Bot has connected and is ready to roll!',
  // error message | error code
  disconnected: 'Disconnected: {} ({})',
  // serverId
  unableToGetGuild: 'Unable to find the provided serverId ({}), are you sure it\'s correct?',
  // textChannelId
  unableToGetTextChannel: 'Unable to find the provided textChannelId ({}), are you sure it\'s correct?',
};

module.exports = {
  reply,
  log,
};
