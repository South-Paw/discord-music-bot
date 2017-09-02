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

/* eslint-disable no-console */
const Discord = require('discord.js');
const format = require('string-format');

const defaultLogging = require('./config/logging.js');
const defaultReplies = require('./config/replies.js');
const defaultSettings = require('./config/settings.js');

const commands = require('./commands/index.js');

const commandGroup = 'general';

class MusicBot {
  /**
   * MusicBot constructor.
   *
   * @param {object} userConfig - A user config with at least a `token`, `serverId` and
   *                             `textChannelId` so that the bot can connect. `settings` and
   *                             `messages` objects are optional and the bot will fall back to the
   *                             defaults if they are not provided.
   */
  constructor(userConfig) {
    // Required user config items to setup the bot.
    this.token = userConfig.token;
    this.serverId = userConfig.serverId;
    this.textChannelId = userConfig.textChannelId;

    // Load default logging messages and any user defined logging messages.
    this.defaultLogging = defaultLogging;
    this.logging = userConfig.logging;

    // Load default bot replies and any user defined replies.
    this.defaultReplies = defaultReplies;
    this.replies = userConfig.replies;

    // Load default settings and any user defined settings.
    this.defaultSettings = defaultSettings;
    this.settings = userConfig.settings;

    // Load bot commands.
    this.commands = commands;

    this.activeTextChannel = null;
    this.activeVoiceChannel = null;
    this.activeVoiceConnection = null;

    this.bot = new Discord.Client({
      autoReconnect: true,
      max_message_cache: 0,
    });
  }

  /**
   * Looks for a given key in the user defined log messages object and falls back onto the default
   * log message list if it was unset.
   *
   * @param  {string} key - The key to look for in the log messages.
   * @return {string}     - The corresponding message for the key.
   */
  getLogMsg(key) {
    return (
      (this.logging && this.logging[key] != null)
        ? this.logging[key]
        : this.defaultLogging[key]
    );
  }

  /**
   * Looks for a given key in the user defined replies object and falls back onto the default
   * replies list if it was unset.
   *
   * @param  {string} group - The message group to look in.
   * @param  {string} key   - The key to look for in the message group.
   * @return {string}       - The corresponding message for the group and key.
   */
  getReplyMsg(group, key) {
    return (
      (this.replies && this.replies[group] && this.replies[group][key] != null)
        ? this.replies[group][key]
        : this.defaultReplies[group][key]
    );
  }

  /**
   * Look for a given key in the user defined settings and fallback to the defaults if unset.
   *
   * @param  {string} key    - The key to look for in the settings object.
   * @return {string|number} - The corresponding string or number for that key.
   */
  getSetting(key) {
    return (
      (this.settings && this.settings[key] != null)
        ? this.settings[key]
        : this.defaultSettings[key]
    );
  }

  /**
   * Set the active voice channel and connection.
   *
   * @param {object} newVoiceChannel    - The new voice channel's object.
   * @param {object} newVoiceConnection - The new voice connection's object.
   */
  setActiveVoiceConnection(newVoiceChannel, newVoiceConnection) {
    this.activeVoiceChannel = newVoiceChannel;
    this.activeVoiceConnection = newVoiceConnection;
  }

  /**
   * Given a string for a command (with the commandPrefix removed), checks each command's aliases
   * to find a matching command and returns it.
   *
   * @param  {string} command - A command's alias with the commandPrefix removed.
   * @return {object}         - The corresponding command object or false if none was found.
   */
  findCommand(command) {
    for (let i = 0; i < this.commands.length; i += 1) {
      const thisCmd = this.commands[i];

      for (let j = 0; j < thisCmd.info.aliases.length; j += 1) {
        if (thisCmd.info.aliases[j] === command.toLowerCase()) {
          return thisCmd;
        }
      }
    }

    return false;
  }

  /**
   * Given a message that contains a command (as indicated by the first character of the message
   * being the commandPrefix), find the command and execute it or respond to the user.
   *
   * @param  {object} message - A discord.js message object.
   */
  handleCommand(message) {
    const params = message.content.slice(1).split(' ');
    const command = this.findCommand(params[0]);
    const args = params.slice(1);

    if (command === false) {
      message.reply(this.getReplyMsg(commandGroup, 'unknownCommand'));
    } else {
      command.run(this, message, args);
    }

    // TODO: clean up old messages - add timeout on the message and delete after an amount of time?
  }

  /**
   * Entry point for running the MusicBot.
   */
  run() {
    this.bot.on('ready', () => this.onReady());
    this.bot.on('message', message => this.onMessage(message));
    this.bot.on('disconnect', event => this.onDisconnect(event));

    if (!this.token || !this.serverId || !this.textChannelId) {
      throw new Error(this.getLogMsg('configMissing'));
    }

    this.bot.login(this.token);
  }

  onReady() {
    const server = this.bot.guilds.get(this.serverId);

    if (server == null) {
      throw new Error(format(this.getLogMsg('unableToGetGuild'), this.serverId));
    }

    this.activeTextChannel = server.channels.find(channel =>
      (channel.id === this.textChannelId) && (channel.type === 'text'));

    if (this.activeTextChannel == null) {
      throw new Error(format(this.getLogMsg('unableToGetTextChannel'), this.textChannelId));
    }

    this.bot.user.setGame();

    console.log(this.getLogMsg('connected'));
  }

  onMessage(message) {
    const isNotOwnMessage = (message.author.id !== this.bot.user.id);
    const isInCommandsChannel = (message.channel.name === this.activeTextChannel.name);

    if (isNotOwnMessage) {
      if (isInCommandsChannel) {
        if (message.isMentioned(this.bot.user)) {
          message.channel.send(format(this.getReplyMsg(commandGroup, 'mentionedMessage'), message.member.toString(), `${this.getSetting('commandPrefix')}help`));
        } else if (message.content[0] === this.getSetting('commandPrefix')) {
          this.handleCommand(message);
        }
      }
    }
  }

  onDisconnect(event) {
    console.log(format(this.getLogMsg('disconnected'), event.reason, event.code));
  }
}

module.exports = MusicBot;
