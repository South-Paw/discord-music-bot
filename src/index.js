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
const ytdl = require('ytdl-core');
const commands = require('./commands/index.js');
const defaultLogging = require('./config/logging.js');
const defaultReplies = require('./config/replies.js');
const defaultSettings = require('./config/settings.js');
const defaultPermissions = require('./config/permissions.js');
const util = require('./util/util.js');

const COMMAND_GROUP = 'general';

class MusicBot {
  /**
   * MusicBot constructor.
   *
   * @param {object} userConfig               - A user config with at least the `token`, `serverId`
   *                                            and `textChannelId` provided.
   * @param {string} userConfig.token         - Your applications unique discord token.
   * @param {string} userConfig.serverId      - The server id the bot should connect to.
   * @param {string} userConfig.textChannelId - The text channel id the bot will take commands from.
   * @param {object} [userConfig.logging]     - Any user defined log messages to override defaults.
   * @param {object} [userConfig.replies]     - Any user defined replies to override defaults.
   * @param {object} [userConfig.settings]    - Any user defined settings to override defaults.
   * @param {object} [userConfig.permissions] - Any user defined permissions to override defaults.
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

    // Load default permissions and any user defined ones.
    this.defaultPermissions = defaultPermissions;
    this.permissions = userConfig.permissions;

    // Load bot commands.
    this.commands = commands;

    this.activeTextChannel = null;
    this.activeVoiceChannel = null;
    this.activeVoiceConnection = null;
    this.voiceHandler = null;

    this.nowPlaying = null;
    this.playbackPaused = false;
    this.playbackStopped = false;
    this.playlistQueue = [];

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
   * Set all of the bot's state variables back to defaults.
   */
  resetBotState() {
    this.setActiveVoiceConnection(null, null);
    this.voiceHandler = null;
    this.nowPlaying = null;
    this.playbackPaused = false;
    this.playbackStopped = false;
    this.playlistQueue = [];
  }

  /**
   * Set the bot's 'Now Playing' state.
   *
   * @param {string} nowPlaying - The string to set the 'Now Playing' to, pass `null` to clear.
   */
  setBotNowPlaying(nowPlaying) {
    this.bot.user.setActivity(nowPlaying);
  }

  /**
   * Return if the playlist queue has any items in it.
   *
   * @return {boolean} - If the queue contains one or more items.
   */
  isQueueEmpty() {
    return this.playlistQueue.length === 0;
  }

  /**
   * Return if the voicer handler is set.
   *
   * @return {boolean} - If the voiceHandler is set, then true.
   */
  isVoiceHandlerSet() {
    return this.voiceHandler !== null;
  }

  /**
   * Return if the playback has been paused.
   *
   * @return {boolean} - If the playback has been paused or not.
   */
  isPlaybackPaused() {
    return this.playbackPaused;
  }

  /**
   * Set the playback's pause state. True for paused, false for not.
   *
   * @param {boolean} state - If paused (true) or not (false).
   */
  setPlaybackPaused(state) {
    this.playbackPaused = state;
  }

  /**
   * Return if the playback has been stopped.
   *
   * @return {boolean} - If the playback has been stopped or not.
   */
  isPlaybackStopped() {
    return this.playbackStopped;
  }

  /**
   * Set the playback's stopped state. True for stopped, false for not.
   *
   * @param {boolean} state - If stopped (true) or not (false).
   */
  setPlaybackStopped(state) {
    this.playbackStopped = state;
  }

  /**
   * Gets the name of the permission group for a given user id.
   *
   * @param  {string} userId  - The user id to find the group of.
   * @return {string|boolean} - If a groupId is assigned, then it'll return that value otherwose if
   *                            none was found it'll be false.
   */
  getPermissionGroup(userId) {
    return (
      (this.permissions && this.permissions.users && this.permissions.users[userId] != null)
        ? this.permissions.users[userId]
        : false
    );
  }

  /**
   * Retrieves the permissions object for the given groupId.
   *
   * Will check user defined groups first and then fall back onto default groups if they exist.
   * If the groupId was false or not found in either the user defined or default groups then the
   * global permissions object will be returned.
   *
   * @param  {object} user    - The user object that we are getting permissions group for.
   * @param  {string} groupId - The groupId to find the permissions for.
   * @return {object}         - A object of permissions for the groupId.
   */
  getGroupPermissions(user, groupId) {
    const globalPermissions = this.defaultPermissions.global;

    if (this.permissions && this.permissions.groups && this.permissions.groups[groupId] != null) {
      return Object.assign({}, globalPermissions, this.permissions.groups[groupId]);
    }

    if (this.defaultPermissions.groups[groupId] != null) {
      return Object.assign({}, globalPermissions, this.defaultPermissions.groups[groupId]);
    }

    if (!groupId) {
      console.log(format(this.getLogMsg('noPermissionGroup'), user.user.username, user.id));
    } else {
      console.log(format(this.getLogMsg('unknownPermissionGroup'), user.user.username, user.id, groupId));
    }

    return globalPermissions;
  }

  /**
   * Check that a user has permission to run the command.
   *
   * @param  {object} user    - The object of the user who invoked the command.
   * @param  {object} command - The object of the command the user is attempting to invoke.
   * @return {boolean}        - True if the user has permission to run it or false if not.
   */
  checkPermissions(user, command) {
    const userGroup = this.getPermissionGroup(user.id);
    const groupPermissions = this.getGroupPermissions(user, userGroup);

    const commandPerm = command.info.permission;

    return (groupPermissions[commandPerm]);
  }

  /**
   * Given a string for a command (with the commandPrefix removed), checks each command's aliases
   * to find a matching command and returns it.
   *
   * @param  {string} command - A command's alias with the commandPrefix removed.
   * @return {object}         - The corresponding command object or false if none was found.
   */
  findCommand(command) {
    let selected;

    this.commands.forEach((botCommand) => {
      botCommand.info.aliases.forEach((alias) => {
        if (alias === command.toLowerCase()) {
          selected = botCommand;
        }
      });
    });

    if (selected) return selected;
    return false;
  }

  /**
   * Given a message that contains a command (as indicated by the first character of the message
   * being the commandPrefix), find the command and execute it or respond to the user.
   *
   * @param {object} message - A discord.js message object.
   */
  handleCommand(message) {
    const params = message.content.slice(1).split(' ');
    const command = this.findCommand(params[0]);
    const args = params.slice(1);

    let commandResult = '';

    if (command === false) {
      message.reply(this.getReplyMsg(COMMAND_GROUP, 'unknownCommand'));
      commandResult += 'Unknown Command';
    } else if (this.checkPermissions(message.member, command)) {
      command.run(this, message, args);
      commandResult += 'Running Command';
    } else {
      message.reply(this.getReplyMsg(COMMAND_GROUP, 'noPermission'));
      commandResult += 'No Permission';
    }

    const userGroup = this.getPermissionGroup(message.member.id);

    console.log(format(
      this.getLogMsg('onCommand'),
      message.member.user.username,
      message.member.id,
      (!userGroup ? 'global' : userGroup),
      message.content,
      commandResult,
    ));
  }

  /**
   * Trigger the bot to start playing the next song from the queue if there is one.
   */
  playNextSong() {
    if (this.isQueueEmpty()) {
      this.activeTextChannel.send(this.getReplyMsg(COMMAND_GROUP, 'queueEmpty'));
      return;
    }

    const nextSong = this.playlistQueue[0];

    const stream = ytdl(nextSong.url, { filter: 'audioonly' });

    this.nowPlaying = nextSong;

    this.voiceHandler = this.activeVoiceConnection.playStream(stream);
    this.voiceHandler.setVolumeDecibels('-20');

    this.setBotNowPlaying(nextSong.title);

    const embed = util.getNowPlayingEmbed(nextSong);

    this.activeTextChannel.send({ embed });

    this.voiceHandler.on('debug', (info) => {
      console.log(`Stream Debug: ${info}`);
    });

    this.voiceHandler.once('error', (error) => {
      console.log(`Stream Error: ${error}`);
    });

    this.voiceHandler.once('end', (reason) => {
      console.log(`Playback ended, reason: ${reason}`);

      this.nowPlaying = null;
      this.voiceHandler = null;

      this.setBotNowPlaying(null);

      if (!this.isPlaybackStopped() && !this.isQueueEmpty()) {
        this.playNextSong();
      }
    });

    this.playlistQueue.splice(0, 1);
  }

  /**
   * TODO
   * Queue all songs on a given Spotify playlist.
   *
   * @param {object} message       - The original message object.
   * @param {string} playlistOwner - The playlist's owner (username from url).
   * @param {string} playlistId    - The playlist's Spotify id.
   */
  queueSpotifyPlaylist(message, playlistOwner, playlistId) { // eslint-disable-line
    console.log(`Spotify playlist: ${playlistId} by ${playlistOwner}`);
  }

  /**
   * TODO
   * Queue a single Spotify track.
   *
   * @param {object} message - The original message object.
   * @param {string} trackId - The Spotify track's id
   */
  queueSpotifyTrack(message, trackId) { // eslint-disable-line
    console.log(`Spotify song: ${trackId}`);
  }

  /**
   * TODO
   * Queue all videos on a given Youtube playlist.
   *
   * @param {object} message    - The original message object.
   * @param {string} playlistId - The Youtube playlist id.
   */
  queueYoutubePlaylist(message, playlistId) { // eslint-disable-line
    console.log(`Youtube playlist: ${playlistId}`);
  }

  /**
   * Queue a single Youtube video.
   *
   * @param {object} message - The original message object.
   * @param {string} videoId - The Youtube video id.
   */
  queueYoutubeVideo(message, videoId) {
    util.getYoutubeVideoDetails(message.author.username, videoId).then((videoDetails) => {
      this.playlistQueue.push(videoDetails);

      message.reply(format(this.getReplyMsg(COMMAND_GROUP, 'youtubeVideoAdded'), videoDetails.title));

      if (!this.isPlaybackStopped() && !this.isVoiceHandlerSet() && !this.isQueueEmpty()) {
        this.playNextSong();
      }
    });
  }

  /**
   * Called for the initial set up of the bot after it's connected.
   */
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

    this.setBotNowPlaying(null);

    console.log(this.getLogMsg('connected'));
  }

  /**
   * Called when messages are received by the bot.
   *
   * @param {object} message - The received message object.
   */
  onMessage(message) {
    const isNotOwnMessage = (message.author.id !== this.bot.user.id);
    const isInCommandsChannel = (message.channel.name === this.activeTextChannel.name);

    if (isNotOwnMessage) {
      if (isInCommandsChannel) {
        if (message.isMentioned(this.bot.user)) {
          message.channel.send(format(this.getReplyMsg(COMMAND_GROUP, 'mentionedMessage'), message.member.toString(), `${this.getSetting('commandPrefix')}help`));
        } else if (message.content[0] === this.getSetting('commandPrefix')) {
          this.handleCommand(message);
        }
      }
    }
  }

  /**
   * Called when bot disconnects from Discord.
   *
   * @param {object} event - The disconnect event.
   */
  onDisconnect(event) {
    console.log(format(this.getLogMsg('disconnected'), event.reason, event.code));
  }

  /**
   * The point at which all the magic happens from when you start the bot...
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
}

module.exports = MusicBot;
