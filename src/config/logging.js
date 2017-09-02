/**
 * Messages that are used in server logging of the bot actions.
 */
module.exports = {
  configMissing: 'You\'re missing some very important things! Check that your `token`, `serverId` and `textChannelId` are set in the config!',
  connected: 'Bot has connected and is ready to roll!',
  // error message | error code
  disconnected: 'Disconnected: {} ({})',
  // serverId
  unableToGetGuild: 'Unable to find the provided serverId ({}), are you sure it\'s correct?',
  // textChannelId
  unableToGetTextChannel: 'Unable to find the provided textChannelId ({}), are you sure it\'s correct?',
};
