const Command = require('../Command');
const { LOG_ERROR, LOG_INFO, REPLY } = require('../../constants');

class JoinCommand extends Command {
  run() {
    const callerChannel = this.message.member.voiceChannel;

    if (callerChannel != null) {
      if (!callerChannel.joinable) {
        this.bot.messageHandler(REPLY, 'JOIN_COMMAND_CANT_JOIN', this.message);
        return;
      }

      callerChannel
        .join()
        .then(connection => {
          this.bot.setActiveVoiceConnection(connection);
          this.bot.logger(LOG_INFO, `Succesfully joined voice channel '${callerChannel.name}'`);
        })
        .catch(error => {
          this.bot.resetActiveVoiceConnection();
          this.bot.logger(LOG_ERROR, `Something went wrong while joining a voice channel: '${error}'`);
          this.bot.messageHandler(REPLY, 'JOIN_COMMAND_ERROR', this.message, error.message);
        });

      return;
    }

    this.bot.messageHandler(REPLY, 'JOIN_COMMAND_FAILED', this.message);
    this.bot.logger(LOG_INFO, `Attempted to join caller but they were not in a voice channel`);
  }
}

const info = {
  key: 'join_command',
  aliases: ['join', 'j'],
  details: {
    name: 'Join',
    usage: 'join',
    description: 'Bot will join the current voice channel that you are in.',
  },
};

module.exports = { JoinCommand, info };
