/* eslint-env jest */
const { RichEmbed } = require('discord.js');
const format = require('string-format');

const defaultLogging = require('./config/logging.js');
const defaultReplies = require('./config/replies.js');
const defaultSettings = require('./config/settings.js');
const defaultPermissions = require('./config/permissions.js');

const HELP_COMMAND = require('./commands/utility/help.js');
const SET_AVATAR_COMMAND = require('./commands/utility/setavatar.js');

const MusicBot = require('./index');

describe('MusicBot', () => {
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
      const generalGroup = 'general';
      const unknownCommand = 'unknownCommand';

      test('it can be found for a given group and key', () => {
        const message = defaultReplies.general.unknownCommand;
        const bot = new MusicBot({});

        expect(bot.getReplyMsg(generalGroup, unknownCommand)).toBe(message);
      });

      test('it can be found for a given group and key the user overrode', () => {
        const message = 'Custom unknown command message.';
        const bot = new MusicBot({ replies: { [generalGroup]: { [unknownCommand]: message } } });

        expect(bot.getReplyMsg(generalGroup, unknownCommand)).toBe(message);
      });

      test('it will return undefined when the key is not found in the group', () => {
        const bot = new MusicBot({});

        expect(bot.getReplyMsg(generalGroup, 'unknown')).toBe(undefined);
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
    test('the default is a null state', () => {
      const bot = new MusicBot({});

      expect(bot.activeVoiceChannel).toBe(null);
      expect(bot.activeVoiceConnection).toBe(null);
    });

    test('a new voice connection and channel can be set', () => {
      const bot = new MusicBot({});
      const objectA = { a: 'a' };
      const objectB = { b: 'b' };

      bot.setActiveVoiceConnection(objectA, objectB);

      expect(bot.activeVoiceChannel).toBe(objectA);
      expect(bot.activeVoiceConnection).toBe(objectB);
    });
  });

  describe('resetBotState()', () => {
    test('clears bot state back to default', () => {
      const bot = new MusicBot({});

      bot.setActiveVoiceConnection({ q: 'w' }, { z: 'x' });
      bot.voiceHandler = 'voiceHandler';
      bot.nowPlaying = 'nowPlaying';
      bot.playbackPaused = true;
      bot.playbackStopped = true;
      bot.playlistQueue = ['a', 'b', 'c'];

      bot.resetBotState();

      expect(bot.activeVoiceChannel).toBe(null);
      expect(bot.activeVoiceConnection).toBe(null);
      expect(bot.voiceHandler).toBe(null);
      expect(bot.nowPlaying).toBe(null);
      expect(bot.playbackPaused).toBe(false);
      expect(bot.playbackStopped).toBe(false);
      expect(bot.playlistQueue.length).toBe(0);
    });
  });

  describe('setBotNowPlaying()', () => {
    test('the now playing string can be cleared', () => {
      const bot = new MusicBot({});
      const nowPlaying = null;

      bot.bot.user = {
        presence: { game: 'hello world!' },
        setActivity: (string) => { bot.bot.user.presence = { game: string }; },
      };

      bot.setBotNowPlaying(nowPlaying);

      expect(bot.bot.user.presence.game).toBe(nowPlaying);
    });

    test('the now playing string is set', () => {
      const bot = new MusicBot({});
      const nowPlaying = 'test now playing';

      bot.bot.user = {
        presence: { game: null },
        setActivity: (string) => { bot.bot.user.presence = { game: string }; },
      };

      bot.setBotNowPlaying(nowPlaying);

      expect(bot.bot.user.presence.game).toBe(nowPlaying);
    });
  });

  describe('isQueueEmpty()', () => {
    test('returns true after the queue has items added', () => {
      const bot = new MusicBot({});
      bot.playlistQueue = ['a', 'b', 'c'];

      expect(bot.isQueueEmpty()).toBe(false);
    });

    test('returns false if the queue does not have items', () => {
      const bot = new MusicBot({});

      expect(bot.isQueueEmpty()).toBe(true);
    });
  });

  describe('isVoiceHandlerSet()', () => {
    test('returns true after the voice handler has been set', () => {
      const bot = new MusicBot({});
      bot.voiceHandler = 'voiceHandler';

      expect(bot.isVoiceHandlerSet()).toBe(true);
    });

    test('returns false if the voice handler has not been set', () => {
      const bot = new MusicBot({});

      expect(bot.isVoiceHandlerSet()).toBe(false);
    });
  });

  describe('isPlaybackPaused() and setPlaybackPaused()', () => {
    test('allows the playback paused state to be set with setPlaybackPaused()', () => {
      const bot = new MusicBot({});
      bot.setPlaybackPaused(true);

      expect(bot.isPlaybackPaused()).toBe(true);
    });
  });

  describe('isPlaybackStopped() and setPlaybackStopped()', () => {
    test('allows the playback stopped state to be set with setPlaybackStopped()', () => {
      const bot = new MusicBot({});
      bot.setPlaybackStopped(true);

      expect(bot.isPlaybackStopped()).toBe(true);
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

        const expected = Object.assign(
          {},
          defaultPermissions.global,
          config.permissions.groups[groupId],
        );

        expect(bot.getGroupPermissions(user, groupId)).toEqual(expected);
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

        const expected = Object.assign(
          {},
          defaultPermissions.global,
          defaultPermissions.groups[groupId],
        );

        expect(bot.getGroupPermissions(user, groupId)).toEqual(expected);
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

        const expected = Object.assign(
          {},
          defaultPermissions.global,
          defaultPermissions.groups[groupId],
        );

        expect(bot.getGroupPermissions(user, groupId)).toEqual(expected);
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
        test('then a reply to the user with an unknown command message is sent', () => {
          let response;

          const message = {
            content: '!abc',
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

          expect(response).toBe(defaultReplies.general.unknownCommand);
        });
      });

      describe('if the command is valid', () => {
        test('and the given the user has permissions to use it, it is run', () => {
          let response;

          const message = {
            content: '!skip',
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

          expect(response).toBe(defaultReplies.skipCommand.notConnectedToVoice);
        });

        test('but the given user does not have permission to use it, then it replies with a no permission message', () => {
          let response;

          const message = {
            content: '!setavatar thisimageurl',
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

          expect(response).toBe(defaultReplies.general.noPermission);
        });
      });
    });
  });

  xdescribe('playNextSong()', () => {
  });

  xdescribe('queueSpotifyPlaylist()', () => {
  });

  xdescribe('queueSpotifyTrack()', () => {
  });

  xdescribe('queueYoutubePlaylist()', () => {
  });

  xdescribe('queueYoutubeVideo()', () => {
  });

  xdescribe('onReady()', () => {
    describe('When the bot is started and ready', () => {
      test('it connects to the given serverId', () => {
        expect(false).toBe(true);
      });

      test('it connects to the given textChannelId', () => {
        expect(false).toBe(true);
      });

      test('it makes a call to clear the set game', () => {
        expect(false).toBe(true);
      });
    });
  });

  describe('onMessage()', () => {
    describe('When the bot receives a message', () => {
      test('it doesn\'t reply if it was it\'s own message', () => {
        const botId = 'itme123';
        const channelName = 'channelname123';

        let response;

        const message = {
          content: 'my own message',
          reply: (text) => {
            response = text;
          },
          author: {
            id: botId,
          },
          channel: {
            name: channelName,
          },
        };

        const bot = new MusicBot({});

        bot.bot.user = { id: botId };
        bot.activeTextChannel = { name: channelName };

        bot.onMessage(message);

        expect(response).toBeUndefined();
      });

      test('it doesn\'t reply if it wasn\'t in the commands channel', () => {
        const userId = 'itme456';
        const botId = 'itme123';
        const channelNameA = 'channelname123';
        const channelNameB = 'channelname456';

        let response = 'abc';

        const message = {
          content: 'this image url',
          reply: (text) => {
            response = text;
          },
          author: {
            id: userId,
          },
          channel: {
            name: channelNameA,
          },
        };

        const bot = new MusicBot({});

        bot.bot.user = { id: botId };
        bot.activeTextChannel = { name: channelNameB };

        bot.onMessage(message);

        expect(response).toBe('abc');
      });

      test('it replies directly to the user if it was mentioned', () => {
        const userId = 'itme456';
        const botId = 'itme123';
        const channelName = 'channelname123';

        const expectedOutput = format(
          defaultReplies.general.mentionedMessage,
          userId,
          `${defaultSettings.commandPrefix}help`,
        );

        let response;

        const message = {
          content: 'hello!',
          author: {
            id: userId,
          },
          member: {
            toString: () => userId,
          },
          channel: {
            name: channelName,
            send: (text) => {
              response = text;
            },
          },
          isMentioned: () => true,
        };

        const bot = new MusicBot({});

        bot.bot.user = { id: botId };
        bot.activeTextChannel = { name: channelName };

        bot.onMessage(message);

        expect(response).toBe(expectedOutput);
      });

      test('it attempts to handle the command if the message begun with the command prefix', () => {
        const userId = 'itme456';
        const botId = 'itme123';
        const channelName = 'channelname123';

        let response;

        const message = {
          content: '!help',
          author: {
            id: userId,
          },
          member: {
            toString: () => userId,
          },
          channel: {
            name: channelName,
          },
          isMentioned: () => false,
        };

        const bot = new MusicBot({});

        bot.bot.user = { id: botId };
        bot.activeTextChannel = { name: channelName };
        bot.handleCommand = (cmdMessage) => {
          response = cmdMessage.content;
        };

        bot.onMessage(message);

        expect(response).toBe(message.content);
      });
    });
  });

  xdescribe('onDisconnect()', () => {
    describe('When a disconnect happens', () => {
      test('the bot logs a message to the console with the event', () => {
        expect(false).toBe(true);
      });
    });
  });

  xdescribe('run()', () => {
    describe('When the bot is started', () => {
      test('it checks that a token, serverId and textChannelId were set', () => {
        expect(false).toBe(true);
      });
    });
  });
});
