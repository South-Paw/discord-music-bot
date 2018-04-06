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

const messageHandlers = require('./handlers/message.js');
const {
  constants: messageConstants,
  messages: defaultMessages,
} = require('./config/messages.js');
const {
  defaultGlobal: defaultGlobalPermissions,
  defaultGroups: defaultPermissionGroups,
} = require('./config/permissions.js');
const {
  preferences: defaultPreferences,
} = require('./config/preferences.js');
const {
  LOG_INFO,
  LOG_WARN,
  LOG_ERROR,
  LOG_DEBUG,
} = require('./constants.js');

const {
  BOT_MENTIONED,
} = messageConstants;

const defaultState = {
};

class MusicBot {
  constructor({
    token,
    serverId,
    textChannelId,
    messages = {},
    permissions = {},
    preferences = {},
    debug = false,
  }) {
    const { groups, users } = permissions;

    this.settings = {
      token,
      serverId,
      textChannelId,
      messages: { ...defaultMessages, ...messages },
      permissions: {
        global: { ...defaultGlobalPermissions },
        groups: { ...defaultPermissionGroups, ...groups },
        users: { ...users },
      },
      preferences: { ...defaultPreferences, ...preferences },
      debug,
    };

    this.state = { ...defaultState };

    this.bot = new Discord.Client();
  }

  isDebug() {
    return this.settings.debug;
  }

  logger(level, message) {
    /* eslint-disable no-console */
    switch (level) {
      case LOG_INFO:
        console.info(message);
        break;
      case LOG_WARN:
        console.warn(message);
        break;
      case LOG_ERROR:
        console.error(message);
        break;
      case LOG_DEBUG:
        if (this.isDebug()) console.debug(message);
        break;
      default:
        console.log(message);
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
    this.state = { ...this.state, ...newState };
  }

  resetState() {
    this.state = { ...defaultState };
  }

  messageHandler(messageKey, message) {
    if (messageHandlers[messageKey]) {
      return messageHandlers[messageKey](this, message);
    }

    throw new Error(`Failed to handle message with key '${messageKey}'`);
  }

  onReady() {
    const { serverId, textChannelId } = this.settings;

    const server = this.bot.guilds.get(serverId);
    if (!server) {
      throw new Error(`Failed to connect to serverId '${serverId}'`);
    }

    const activeTextChannel = server.channels.find(({ id, type }) => (id === textChannelId) && (type === 'text'));
    if (!activeTextChannel) {
      throw new Error(`Failed to find textChannelId '${textChannelId}'`);
    }

    this.setState({ activeTextChannel });

    this.logger(LOG_INFO, `Successfully connected to '${server.name}'`);
  }

  onMessage(message) {
    const { author, channel } = message;
    const { activeTextChannel } = this.state;

    const isInCommandsChannel = (channel.name === activeTextChannel.name);
    const isNotOwnMessage = (author.id !== this.bot.user.id);

    if (isInCommandsChannel && isNotOwnMessage) {
      if (message.isMentioned(this.bot.user)) {
        message.channel.send(this.messageHandler(BOT_MENTIONED, message));
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
