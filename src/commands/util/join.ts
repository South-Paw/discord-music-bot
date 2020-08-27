import { Command, CommandObject, CommandPermissionLevel } from '../types';

class JoinCommand extends Command {
  run() {
    console.log('join', this.bot.state);
  }
}

const joinCommand: CommandObject = {
  details: {
    name: 'Join',
    usage: 'join',
    description: 'Bot will join the current voice channel that you are in.',
  },
  aliases: ['join', 'j'],
  permissionLevel: CommandPermissionLevel.ANY,
  command: JoinCommand,
};

export default joinCommand;
