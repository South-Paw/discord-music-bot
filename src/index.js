/**
 * Copyright (C) 2017 Alex Gabites
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

const Discord = require('discord.js');
const deepmerge = require('deepmerge');

const { defaultCommands, defaultCommandDetails } = require('./defaults/commands');
const { defaultMessageStrings, messageFunctions } = require('./defaults/messages');
const { defaultGlobalPermissions, defaultGroupPermissions } = require('./defaults/permissions');
const defaultPreferences = require('./defaults/preferences');

const { LOG_INFO, LOG_WARN, LOG_ERROR, LOG_DEBUG, SEND, REPLY, DIRECT_MESSAGE } = require('./constants');
const { findCommandKeyByAlias, getLoggerPrefix } = require('./util');

const defaultState = {
  activeTextChannelId: null,
};

class MusicBot {
  constructor(config) {
    const {
      token,
      serverId,
      textChannelId,
      commands = {},
      commandDetails = {},
      messageStrings = {},
      permissions = {},
      preferences = {},
      debug = false,
    } = config;

    const { global: globalPermissions = {}, groups: groupPermissions = {}, users: usersPermissions = {} } = permissions;

    const groupPermissionsWithDefaults = {};

    // Ensure that any provided groupPermissions also contain the defaultGlobalPermissions, otherwise groups may not have access to all commands.
    Object.keys(groupPermissions).forEach(key => {
      groupPermissionsWithDefaults[key] = deepmerge(defaultGlobalPermissions, groupPermissions[key]);
    });

    this.settings = {
      token,
      serverId,
      textChannelId,
      commands: deepmerge(defaultCommands, commands),
      commandDetails: deepmerge(defaultCommandDetails, commandDetails),
      messageFunctions,
      messageStrings: deepmerge(defaultMessageStrings, messageStrings),
      permissions: {
        global: deepmerge(defaultGlobalPermissions, globalPermissions),
        groups: deepmerge(defaultGroupPermissions, groupPermissionsWithDefaults),
        users: usersPermissions,
      },
      preferences: deepmerge(defaultPreferences, preferences),
      debug,
    };

    this.activeVoiceConnection = null;

    this.state = { ...defaultState };

    this.client = new Discord.Client();
  }

  isDebug() {
    return this.settings.debug;
  }

  logger(level, message, prefix = getLoggerPrefix) {
    /* eslint-disable no-console */
    switch (level) {
      case LOG_INFO:
        console.info(prefix(level), message);
        break;
      case LOG_WARN:
        console.warn(prefix(level), message);
        break;
      case LOG_ERROR:
        console.error(prefix(level), message);
        break;
      case LOG_DEBUG:
        if (this.isDebug()) console.debug(prefix(level), message);
        break;
      default:
        console.log(prefix(level), message);
    }
    /* eslint-enable no-console */
  }

  setState(newState) {
    this.state = deepmerge(this.state, newState);
  }

  resetState() {
    this.state = {
      ...defaultState,
      activeTextChannelId: this.state.activeTextChannelId,
    };
  }

  setActiveVoiceConnection(connection) {
    this.activeVoiceConnection = connection;
  }

  resetActiveVoiceConnection() {
    if (this.activeVoiceConnection) {
      this.activeVoiceConnection.disconnect();
    }

    this.activeVoiceConnection = null;
  }

  messageHandler(type, key, message, ...other) {
    const messageString = this.settings.messageStrings[key];
    const messageFunction = this.settings.messageFunctions[key];

    if (!messageString || !messageFunction) {
      this.logger(LOG_ERROR, `Failed to find message (string or function) with key '${key}'`);
      return;
    }

    const response = messageFunction(messageString, this, message, ...other);

    switch (type) {
      case SEND:
        message.channel.send(response);
        break;
      case REPLY:
        message.reply(response);
        break;
      case DIRECT_MESSAGE:
        message.member.createDM().then(dm => dm.send(response));
        break;
      default:
        this.logger(LOG_ERROR, `Unknown message return type '${type}'`);
    }
  }

  hasCommandPermission(userId, commandKey) {
    const { users, groups, global } = this.settings.permissions;
    const groupId = users[`${userId}`];

    if (users[`${userId}`] && groups[`${groupId}`]) {
      return !!groups[`${groupId}`][`${commandKey}`];
    }

    return !!global[`${commandKey}`];
  }

  commandHandler(key, args, message) {
    const CommandClass = this.settings.commands[key];

    if (!CommandClass) {
      this.logger(LOG_ERROR, `Failed to find command with key '${key}'`);
      return;
    }

    this.logger(LOG_INFO, `'${message.member.displayName}' called '${key}' with ${JSON.stringify(args)}`);

    if (!this.hasCommandPermission(message.member.id, key)) {
      this.logger(LOG_INFO, `'${message.member.displayName}' does not have permission for '${key}'`);

      this.messageHandler(REPLY, 'NO_PERMISSION', message);

      return;
    }

    const Command = new CommandClass(this, args, message);
    Command.run();
  }

  onReady() {
    const { serverId, textChannelId } = this.settings;

    const server = this.client.guilds.get(serverId);
    if (!server) {
      throw new Error(`Failed to connect to serverId '${serverId}'`);
    }

    const activeTextChannel = server.channels.find(({ id, type }) => id === textChannelId && type === 'text');
    if (!activeTextChannel) {
      throw new Error(`Failed to find textChannelId '${textChannelId}'`);
    }

    this.setState({ activeTextChannelId: activeTextChannel.id });

    this.logger(LOG_INFO, `Successfully connected to '${server.name}'`);
  }

  onMessage(message) {
    const { author, channel } = message;
    const { activeTextChannelId } = this.state;

    const isInCommandsChannel = channel.id === activeTextChannelId;
    const isNotOwnMessage = author.id !== this.client.user.id;

    if (isInCommandsChannel && isNotOwnMessage) {
      // If the message begins with the command prefix
      if (message.content && message.content[0] === this.settings.preferences.COMMAND_PREFIX) {
        const params = message.content
          .slice(1)
          .split(' ')
          .filter(param => param.length > 0);

        const commandAlias = findCommandKeyByAlias(this.settings.commandDetails, params[0]);

        if (!commandAlias) {
          this.messageHandler(REPLY, 'UNKNOWN_COMMAND', message);
          return;
        }

        this.commandHandler(commandAlias, params.slice(1), message);
        return;
      }

      // If the message mentions the bot
      if (message.isMentioned(this.client.user)) {
        this.messageHandler(SEND, 'BOT_MENTIONED', message);
      }
    }
  }

  onDisconnect({ reason, code }) {
    this.logger(LOG_ERROR, `Bot was disconnected from server.\nReason: ${reason}\nCode: ${code}`);

    throw new Error('Bot was disconnected from server.');
  }

  run() {
    const { token, serverId, textChannelId } = this.settings;
    const prefix = 'Failed to initialise:';

    if (!token) {
      throw new Error(`${prefix} a 'token' was not provided in the config!`);
    }

    if (!serverId) {
      throw new Error(`${prefix} a 'serverId' was not provided in the config!`);
    }

    if (!textChannelId) {
      throw new Error(`${prefix} a 'textChannelId' was not provided in the config!`);
    }

    this.client.on('ready', () => this.onReady());
    this.client.on('message', message => this.onMessage(message));
    this.client.on('disconnect', event => this.onDisconnect(event));

    this.logger(LOG_INFO, 'Logging into server...');

    this.client.login(token);
  }
}

module.exports = MusicBot;
