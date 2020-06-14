export enum CommandPermissionLevel {
  ANY = 'any',
  ROLE = 'role',
  ADMIN = 'admin',
}

export class Command {
  run = () => {};
}

export interface CommandObject {
  /** aliases of the command for users to call it with */
  aliases: string[];
  /** which user group(s) are allowed to use this commnad */
  permissionLevel: CommandPermissionLevel;
  /** command class */
  command: typeof Command;
  /** additional command details */
  details: {
    /** name of the command */
    name: string;
    /** suggested usage */
    usage: string;
    /** short description of the command */
    description: string;
  };
}
