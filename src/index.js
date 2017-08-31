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

const CONSTANTS = require('./util/constants.js');

const commands = require('./commands/index.js');

class MusicBot {
  constructor(token, serverId, textChannelId) {
    this.token = token;
    this.serverId = serverId;
    this.textChannelId = textChannelId;

    this.activeTextChannel = null;

    this.activeVoiceChannel = null;
    this.activeVoiceConnection = null;

    this.commands = commands;

    this.bot = new Discord.Client({
      autoReconnect: true,
      max_message_cache: 0,
    });
  }

  setActiveVoiceConnection(newVoiceChannel, newVoiceConnection) {
    this.activeVoiceChannel = newVoiceChannel;
    this.activeVoiceConnection = newVoiceConnection;
  }

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

  handleCommand(message) {
    const params = message.content.slice(1).split(' ');
    const command = this.findCommand(params[0]);
    const args = params.slice(1);

    if (command === false) {
      message.reply('Hmmm. I couldn\'t find that command... did you mistype it?');
    } else {
      command.run(this, message, args);
    }

    // clean up messages ?
    // timeout on the message and delete after certain amount of time?
  }

  run() {
    this.bot.on('ready', () => this.onReady());
    this.bot.on('message', message => this.onMessage(message));
    this.bot.on('disconnect', event => this.onDisconnect(event));

    this.bot.login(this.token);
  }

  onReady() {
    const server = this.bot.guilds.get(this.serverId);

    if (server == null) {
      throw new Error();
    }

    this.activeTextChannel = server.channels.find(channel =>
      (channel.id === this.textChannelId) && (channel.type === 'text'));

    if (this.activeTextChannel == null) {
      throw new Error();
    }

    this.bot.user.setGame();

    console.log('Bot has connected and is ready to roll!');
  }

  // eslint-disable-next-line
  onMessage(message) {
    const isNotOwnMessage = (message.author.id !== this.bot.user.id);
    const isIncommandsChannel = (message.channel.name === this.activeTextChannel.name);

    if (isNotOwnMessage) {
      if (isIncommandsChannel) {
        if (message.isMentioned(this.bot.user)) {
          this.activeTextChannel.send(`Hey ${message.member.toString()}, you should try \`!help\` for a list of commands. :thumbsup:`);
        } else if (message.content[0] === CONSTANTS.defaults.commandIdentifer) {
          this.handleCommand(message);
        }
      }
    }
  }

  // eslint-disable-next-line
  onDisconnect(event) {
    console.log(`Disconnected: ${event.reason} (${event.code})`);
  }
}

module.exports = MusicBot;
