/**
 * Messages that are used in server logging of the bot actions.
 */
module.exports = {
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
  // username | userId | command string | command result
  onCommand: '"{}" (id: {} | group: {}) issued "{}" | {}',
  // username | userId
  noPermissionGroup: '"{}" (id: {}) does not have a permission group assigned, falling back on global permissions.',
  // username | userId | groupId
  unknownPermissionGroup: '"{}" (id: {}) is assigned to group "{}" but it is not defined, falling back on global permissions.',
};
