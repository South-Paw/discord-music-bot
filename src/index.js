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
const merge = require('deepmerge');

const messageHandlers = require('./handlers/message');
const commandHandlers = require('./handlers/command');
const { messageConstants, defaultMessages } = require('./config/messages');
const { defaultGlobalPermissions, defaultPermissionGroups } = require('./config/permissions');
const { preferenceConstants, defaultPreferences } = require('./config/preferences');
const { LOG_INFO, LOG_WARN, LOG_ERROR, LOG_DEBUG } = require('./constants');
const { findCommandKeyByAlias, getLoggerPrefix } = require('./util');

const { BOT_MENTIONED, UNKNOWN_COMMAND } = messageConstants;
const { COMMAND_PREFIX } = preferenceConstants;

const defaultState = {};

class MusicBot {
  constructor({ token, serverId, textChannelId, messages = {}, permissions = {}, preferences = {}, debug = false }) {
    const { groups = {}, users = {} } = permissions;

    this.settings = {
      token,
      serverId,
      textChannelId,
      messages: merge(defaultMessages, messages),
      permissions: {
        global: { ...defaultGlobalPermissions },
        groups: merge(defaultPermissionGroups, groups),
        users: { ...users },
      },
      preferences: merge(defaultPreferences, preferences),
      debug,
    };

    this.state = { ...defaultState };

    this.bot = new Discord.Client();
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

  getMessage(key) {
    if (!this.settings.messages[key]) {
      throw new Error(`Failed to get message with key '${key}'`);
    }

    return this.settings.messages[key];
  }

  getPreference(key) {
    if (!this.settings.preferences[key]) {
      throw new Error(`Failed to get preference with key '${key}'`);
    }

    return this.settings.preferences[key];
  }

  setState(newState) {
    this.state = merge(this.state, newState);
  }

  resetState() {
    this.state = { ...defaultState };
  }

  messageHandler(messageKey, message) {
    // TODO: log that message was handled

    if (messageHandlers[messageKey]) {
      return messageHandlers[messageKey](this, message);
    }

    throw new Error(`Failed to handle message with key '${messageKey}'`);
  }

  commandHandler(commandKey, args, message) {
    // TODO: log that command was handled

    if (commandHandlers[commandKey]) {
      // TODO: check user has command permissions before calling it

      return commandHandlers[commandKey](this, args, message);
    }

    throw new Error(`Failed to handle command with key '${commandKey}'`);
  }

  onReady() {
    const { serverId, textChannelId } = this.settings;

    const server = this.bot.guilds.get(serverId);
    if (!server) {
      throw new Error(`Failed to connect to serverId '${serverId}'`);
    }

    const activeTextChannel = server.channels.find(({ id, type }) => id === textChannelId && type === 'text');
    if (!activeTextChannel) {
      throw new Error(`Failed to find textChannelId '${textChannelId}'`);
    }

    this.setState({ activeTextChannel });

    this.logger(LOG_INFO, `Successfully connected to '${server.name}'`);
  }

  onMessage(message) {
    const { author, channel } = message;
    const { activeTextChannel } = this.state;

    const isInCommandsChannel = channel.name === activeTextChannel.name;
    const isNotOwnMessage = author.id !== this.bot.user.id;

    if (isInCommandsChannel && isNotOwnMessage) {
      if (message.isMentioned(this.bot.user)) {
        message.channel.send(this.messageHandler(BOT_MENTIONED, message));
        return;
      }

      if (message.content && message.content[0] === this.getPreference(COMMAND_PREFIX)) {
        const params = message.content.slice(1).split(' ');
        const commandAlias = findCommandKeyByAlias(params[0]);

        if (!commandAlias) {
          message.channel.send(this.messageHandler(UNKNOWN_COMMAND, message));
          return;
        }

        this.commandHandler(commandAlias, params.slice(1), message);
      }
    }
  }

  onDisconnect({ reason, code }) {
    this.logger(LOG_ERROR, `Bot was disconnected from server.\nReason: ${reason}\nCode: ${code}`);

    throw new Error('Bot was disconnected from server.');
  }

  init() {
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

    this.bot.on('ready', () => this.onReady());
    this.bot.on('message', message => this.onMessage(message));
    this.bot.on('disconnect', event => this.onDisconnect(event));

    this.logger(LOG_INFO, 'Logging into server...');

    this.bot.login(token);
  }
}

module.exports = MusicBot;
