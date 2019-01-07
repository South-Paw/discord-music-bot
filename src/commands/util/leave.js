const Command = require('../Command');
const { LOG_INFO } = require('../../constants');

class LeaveCommand extends Command {
  run() {
    this.bot.resetActiveVoiceConnection();

    this.bot.logger(LOG_INFO, `Leaving active voice channel`);
  }
}

const info = {
  key: 'leave_command',
  aliases: ['leave', 'l'],
  details: {
    name: 'Leave',
    usage: 'leave',
    description: 'Bot will leave any voice channel it is connected to.',
  },
};

module.exports = { LeaveCommand, info };
