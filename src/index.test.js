/* eslint-env jest */
const RichEmbed = require('discord.js').RichEmbed;

const defaultLogging = require('./config/logging.js');
const defaultReplies = require('./config/replies.js');
const defaultSettings = require('./config/settings.js');
const defaultPermissions = require('./config/permissions.js');

const HELP_COMMAND = require('./commands/utility/help.js');
const SET_AVATAR_COMMAND = require('./commands/utility/setavatar.js');

const MusicBot = require('./index');

describe('getLogMsg()', () => {
  describe('When a log message is required', () => {
    test('it can be found given a valid key', () => {
      const expectedMessage = defaultLogging.connected;
      const bot = new MusicBot({});

      expect(bot.getLogMsg('connected')).toBe(expectedMessage);
    });

    test('it can be found for a key the user overrode', () => {
      const customMessage = 'Custom connected message.';
      const bot = new MusicBot({ logging: { connected: customMessage } });

      expect(bot.getLogMsg('connected')).toBe(customMessage);
    });

    test('it will return undefined when the key is not found', () => {
      const bot = new MusicBot({});

      expect(bot.getLogMsg('nonexistent')).toBe(undefined);
    });
  });
});

describe('getReplyMsg()', () => {
  describe('When a reply message is required', () => {
    test('it can be found for a given group and key', () => {
      const group = 'general';
      const key = 'unknownCommand';
      const message = defaultReplies.general.unknownCommand;
      const bot = new MusicBot({});

      expect(bot.getReplyMsg(group, key)).toBe(message);
    });

    test('it can be found for a given group and key the user overrode', () => {
      const group = 'general';
      const key = 'unknownCommand';
      const message = 'Custom unknown command message.';
      const bot = new MusicBot({ replies: { general: { unknownCommand: message } } });

      expect(bot.getReplyMsg(group, key)).toBe(message);
    });

    test('it will return undefined when the key is not found in the group', () => {
      const group = 'general';
      const key = 'unknown';
      const bot = new MusicBot({});

      expect(bot.getReplyMsg(group, key)).toBe(undefined);
    });
  });
});

describe('getSetting()', () => {
  describe('When a setting is required', () => {
    test('it can be found given a valid key', () => {
      const expectedSetting = defaultSettings.commandPrefix;
      const bot = new MusicBot({});

      expect(bot.getSetting('commandPrefix')).toBe(expectedSetting);
    });

    test('it can be found for a key the user overrode', () => {
      const customSetting = '~';
      const bot = new MusicBot({ settings: { commandPrefix: customSetting } });

      expect(bot.getSetting('commandPrefix')).toBe(customSetting);
    });

    test('it will return undefined when the key is not found', () => {
      const bot = new MusicBot({});

      expect(bot.getSetting('nonexistent')).toBe(undefined);
    });
  });
});

describe('setActiveVoiceConnection()', () => {
  test('a new voice connection and channel can be set', () => {
    const objectA = { a: 'a' };
    const objectB = { b: 'b' };
    const bot = new MusicBot({});

    expect(bot.activeVoiceChannel).toBe(null);
    expect(bot.activeVoiceConnection).toBe(null);

    bot.setActiveVoiceConnection(objectA, objectB);

    expect(bot.activeVoiceChannel).toBe(objectA);
    expect(bot.activeVoiceConnection).toBe(objectB);
  });
});

describe('getPermissionGroup()', () => {
  describe('When a userId is given', () => {
    test('it will return false if they have no corresponding user group', () => {
      const userId = '456def';
      const bot = new MusicBot({});

      expect(bot.getPermissionGroup(userId)).toBe(false);
    });

    test('it will return the user\'s corresponding group when the user was set in the config', () => {
      const userId = '123abc';
      const group = 'admin';
      const bot = new MusicBot({ permissions: { users: { [userId]: group } } });

      expect(bot.getPermissionGroup(userId)).toBe(group);
    });
  });
});

describe('getGroupPermissions()', () => {
  describe('When a user object and groupId are given', () => {
    test('it will return the permissions for that group (after being merged into the global group permissions)', () => {
      const user = {
        id: '123456789',
        user: {
          username: '123abc',
        },
      };

      const groupId = 'group1';

      const config = {
        permissions: {
          groups: {
            [groupId]: {
              help: false,
              setavatar: true,
            },
          },
          users: {
            [user.id]: groupId,
          },
        },
      };

      const bot = new MusicBot(config);

      const expected = Object.assign(defaultPermissions.global, config.permissions.groups[groupId]);

      expect(bot.getGroupPermissions(user, groupId)).toBe(expected);
    });

    test('it will return the global permissions for an undefined group if no custom ones were supplied', () => {
      const user = {
        id: '123456789',
        user: {
          username: '123abc',
        },
      };

      const groupId = 'group1';

      const bot = new MusicBot({});

      const expected = Object.assign(defaultPermissions.global, defaultPermissions.groups[groupId]);

      expect(bot.getGroupPermissions(user, groupId)).toBe(expected);
    });

    test('it will return the default admin permissions if the user was set to the default admin group', () => {
      const user = {
        id: '123456789',
        user: {
          username: '123abc',
        },
      };

      const groupId = 'admin';

      const bot = new MusicBot({});

      const expected = Object.assign(defaultPermissions.global, defaultPermissions.groups[groupId]);

      expect(bot.getGroupPermissions(user, groupId)).toBe(expected);
    });

    test('it will return the default global permissions if the user was not set to any groups', () => {
      const user = {
        id: '123456789',
        user: {
          username: '123abc',
        },
      };

      const groupId = false;

      const bot = new MusicBot({});

      expect(bot.getGroupPermissions(user, groupId)).toBe(defaultPermissions.global);
    });
  });
});

describe('checkPermissions()', () => {
  describe('When a user object and command object are given', () => {
    test('if the user does not have permission to the command, it will return false', () => {
      const user = {
        id: '123456789',
        user: {
          username: '123abc',
        },
      };

      const groupId = 'group1';

      const config = {
        permissions: {
          groups: {
            [groupId]: {
              help: false,
              setavatar: true,
            },
          },
          users: {
            [user.id]: groupId,
          },
        },
      };

      const bot = new MusicBot(config);

      expect(bot.checkPermissions(user, HELP_COMMAND)).toBe(false);
    });

    test('if the user does have permission to the command, it will return true', () => {
      const user = {
        id: '123456789',
        user: {
          username: '123abc',
        },
      };

      const groupId = 'group1';

      const config = {
        permissions: {
          groups: {
            [groupId]: {
              help: false,
              setavatar: true,
            },
          },
          users: {
            [user.id]: groupId,
          },
        },
      };

      const bot = new MusicBot(config);

      expect(bot.checkPermissions(user, SET_AVATAR_COMMAND)).toBe(true);
    });
  });
});

describe('findCommand()', () => {
  describe('When a user invokes a command and it needs to be searched for', () => {
    test('it can be found if the alias is valid', () => {
      const commandAlias = 'help';
      const bot = new MusicBot({});

      expect(bot.findCommand(commandAlias)).toBe(HELP_COMMAND);
    });

    test('it will return false if the alias was invalid', () => {
      const commandAlias = 'blah';
      const bot = new MusicBot({});

      expect(bot.findCommand(commandAlias)).toBe(false);
    });
  });
});

describe('handleCommand()', () => {
  describe('When a user invokes a command', () => {
    test('if it had arguments then they are passed to the command', () => {
      let response;

      const expectedEmbed = HELP_COMMAND.infoToEmbed('!', HELP_COMMAND.info);

      const message = {
        content: '!help help',
        reply: (text) => {
          response = text;
        },
        member: {
          id: '123456789',
          user: {
            username: '123abc',
          },
        },
      };

      const groupId = 'group1';

      const config = {
        permissions: {
          groups: {
            [groupId]: {
              help: true,
            },
          },
          users: {
            [message.member.id]: groupId,
          },
        },
      };

      const bot = new MusicBot(config);

      bot.handleCommand(message);

      expect(response.embed).toBeInstanceOf(RichEmbed);
      expect(response.embed.description).toBe(expectedEmbed.description);
    });

    describe('if the command is invalid', () => {
      xtest('then a reply to the user with an unknown command message is sent', () => {
        expect(false).toBe(true);
      });
    });

    describe('if the command is valid', () => {
      xtest('and the given the user has permissions to use it, it is run', () => {
        expect(false).toBe(true);
      });

      xtest('but the given user does not have permission to use it, then a reply is made with a no permission message', () => {
        expect(false).toBe(true);
      });
    });
  });
});

describe('run()', () => {
  describe('When the bot is started', () => {
    xtest('it checks that a token, serverId and textChannelId were set', () => {
      expect(false).toBe(true);
    });
  });
});

describe('onReady()', () => {
  describe('When the bot is started and ready', () => {
    xtest('it connects to the given serverId', () => {
      expect(false).toBe(true);
    });

    xtest('it connects to the given textChannelId', () => {
      expect(false).toBe(true);
    });

    xtest('it makes a call to clear the set game', () => {
      expect(false).toBe(true);
    });
  });
});

describe('onMessage()', () => {
  describe('When the bot receives a message', () => {
    xtest('it doesn\'t reply if it was it\'s own message', () => {
      expect(false).toBe(true);
    });

    xtest('it doesn\'t reply if it wasn\'t in the commands channel', () => {
      expect(false).toBe(true);
    });

    xtest('it replies directly to the user if it was mentioned', () => {
      expect(false).toBe(true);
    });

    xtest('it attempts to handle the command if the message begun with the command prefix', () => {
      expect(false).toBe(true);
    });
  });
});

describe('onDisconnect()', () => {
  describe('When a disconnect happens', () => {
    xtest('the bot logs a message to the console with the event', () => {
      expect(false).toBe(true);
    });
  });
});
