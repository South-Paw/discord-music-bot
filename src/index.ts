import deepmerge from 'deepmerge';
import { Client, GuildMember, Message } from 'discord.js';
import format from 'string-format';
import { commands } from './commands';
import { CommandObject, CommandPermissionLevel } from './commands/types';
import { BOT_MENTIONED, UNKNOWN_COMMAND } from './constants/messages';
import { logger } from './util/logger';

interface MusicBotConfig {
  token: string;
  serverId: string;
  textChannelId: string;
  adminUserIds: string[];
  allowedRoleIds: string[];
  commandPrefix?: string;
}

interface MusicBotSettings {
  token: string;
  serverId: string;
  textChannelId: string;
  adminUserIds: string[];
  allowedRoleIds: string[];
  commandPrefix: string;
}

interface MusicBotState {
  activeTextChannelId?: string;
}

const defaultState: MusicBotState = {
  activeTextChannelId: undefined,
};

export class MusicBot {
  private readonly client: Client;

  private readonly settings: MusicBotSettings;

  public state: MusicBotState;

  private commands = commands;

  // private activeVoiceConnection: any;

  constructor({ token, serverId, textChannelId, adminUserIds, allowedRoleIds, commandPrefix = '!' }: MusicBotConfig) {
    if (!token) {
      throw new Error(`Failed to initialise: 'token' was not provided in the config!`);
    }

    if (!serverId) {
      throw new Error(`Failed to initialise: 'serverId' was not provided in the config!`);
    }

    if (!textChannelId) {
      throw new Error(`Failed to initialise: 'textChannelId' was not provided in the config!`);
    }

    this.client = new Client();

    this.settings = {
      token,
      serverId,
      textChannelId,
      adminUserIds,
      allowedRoleIds,
      commandPrefix,
    };

    this.state = { ...defaultState };

    this.init();
  }

  public setState(nextState: MusicBotState) {
    this.state = deepmerge(this.state, nextState);
  }

  public resetState() {
    const textChannelId = this.state.activeTextChannelId;

    this.state = {
      ...defaultState,
      activeTextChannelId: textChannelId,
    };
  }

  private checkPermissions({ permissionLevel }: CommandObject, member: GuildMember | null) {
    if (permissionLevel === CommandPermissionLevel.ANY) {
      logger.debug(`command has no permissions`);
      return true;
    }

    const isAdmin = this.settings.adminUserIds.includes(member?.id ?? '');

    if (isAdmin) {
      logger.debug(`'${member?.displayName}' is an admin`);

      return true;
    }

    if (permissionLevel === CommandPermissionLevel.ROLE) {
      const hasRole = this.settings.allowedRoleIds.some((role) =>
        member?.roles?.cache ? member.roles.cache.keyArray().indexOf(role) >= 0 : false,
      );

      logger.debug(`'${member?.displayName}' has role = '${hasRole}'`);

      return hasRole;
    }

    return false;
  }

  private commandHandler(command: CommandObject, args: string[], message: Message) {
    logger.info(
      `'${message.member?.displayName}' called '${command.details.name}' command with ${JSON.stringify(args)}`,
    );

    if (!this.checkPermissions(command, message.member)) {
      logger.error(`'${message.member?.displayName}' does not have permission for '${command.details.name}' command`);
      message.reply(`You don't have permission for that command.`);
      return;
    }

    logger.debug('running command', command);

    const { command: Command } = command;

    const cmd = new Command(this, args, message);

    cmd.run();
  }

  private onReady() {}

  private onMessage(message: Message) {
    const isInCommandChannel = message.channel.id === this.state.activeTextChannelId;
    const isNotOwnMessage = message.author.id !== this.client.user?.id;
    const isCommand = message.content[0] === '!';

    if (isInCommandChannel && isNotOwnMessage) {
      if (isCommand) {
        const [command, ...args] = message.content
          .slice(1)
          .split(' ')
          .filter((param) => param.length > 0);

        const cmd = this.commands.find(({ aliases }) => aliases.includes(command));

        if (!cmd) {
          message.channel.send(UNKNOWN_COMMAND);
          return;
        }

        this.commandHandler(cmd, args, message);
      }

      if (this.client.user && message.mentions.has(this.client.user)) {
        message.reply(format(BOT_MENTIONED, this.settings.commandPrefix));
      }
    }
  }

  private onDisconnect(event: any) {
    logger.debug('onDisconnect', event);
  }

  private init() {
    this.client.on('ready', () => this.onReady());
    this.client.on('message', (message) => this.onMessage(message));
    this.client.on('disconnect', (event) => this.onDisconnect(event));
  }

  public start() {
    const { token, textChannelId } = this.settings;

    this.setState({ activeTextChannelId: textChannelId });

    return this.client.login(token);
  }
}
