const MusicBot = require('./index');
const { LOG_INFO, LOG_WARN, LOG_ERROR, LOG_DEBUG, SEND, REPLY, DIRECT_MESSAGE } = require('./constants');
const { defaultMessageStrings } = require('./defaults/messages');
const Command = require('./commands/Command');

const defaultState = {
  activeTextChannelId: null,
};

describe('MusicBot', () => {
  xdescribe('constructor', () => {
    it('merges config `commands` into `this.settings.commands` as expected', () => {});

    it('merges config `commandDetails` into `this.settings.commandDetails` as expected', () => {});

    it('merges config `messageStrings` into `this.settings.messageStrings` as expected', () => {});

    it('merges config `permissions.global` into `this.settings.permissions.global` as expected', () => {});

    it('merges config `permissions.groups` into `this.settings.permissions.groups` as expected', () => {});

    it('merges config `permissions.users` into `this.settings.permissions.users` as expected', () => {});
  });

  describe('isDebug()', () => {
    it('returns false by default', () => {
      const bot = new MusicBot({});

      expect(bot.isDebug()).toBe(false);
    });

    it('returns true if set in the config', () => {
      const bot = new MusicBot({ debug: true });

      expect(bot.isDebug()).toBe(true);
    });
  });

  describe('logger()', () => {
    const noFunc = () => '';

    it('defaults to `console.log`', () => {
      const spy = jest.spyOn(global.console, 'log');

      const testMsg = 'test';
      const bot = new MusicBot({});

      bot.logger(testMsg, testMsg, noFunc);

      expect(spy).toHaveBeenCalledWith(noFunc(), testMsg);

      spy.mockReset();
      spy.mockRestore();
    });

    it('uses `console.info` for `LOG_INFO`', () => {
      const spy = jest.spyOn(global.console, 'info');

      const testMsg = 'test';
      const bot = new MusicBot({});

      bot.logger(LOG_INFO, testMsg, noFunc);

      expect(spy).toHaveBeenCalledWith(noFunc(), testMsg);

      spy.mockReset();
      spy.mockRestore();
    });

    it('uses `console.warn` for `LOG_WARN`', () => {
      const spy = jest.spyOn(global.console, 'warn');

      const testMsg = 'test';
      const bot = new MusicBot({});

      bot.logger(LOG_WARN, testMsg, noFunc);

      expect(spy).toHaveBeenCalledWith(noFunc(), testMsg);

      spy.mockReset();
      spy.mockRestore();
    });

    it('uses `console.error` for `LOG_ERROR`', () => {
      const spy = jest.spyOn(global.console, 'error');

      const testMsg = 'test';
      const bot = new MusicBot({});

      bot.logger(LOG_ERROR, testMsg, noFunc);

      expect(spy).toHaveBeenCalledWith(noFunc(), testMsg);

      spy.mockReset();
      spy.mockRestore();
    });

    it('uses `console.debug` for `LOG_DEBUG` when `isDebug()=true`', () => {
      const spy = jest.spyOn(global.console, 'debug');

      const testMsg = 'test';
      const bot = new MusicBot({ debug: true });

      bot.logger(LOG_DEBUG, testMsg, noFunc);

      expect(spy).toHaveBeenCalledWith(noFunc(), testMsg);

      spy.mockReset();
      spy.mockRestore();
    });

    it("doesn't call `console.debug` for `LOG_DEBUG` when `isDebug=false`", () => {
      const spy = jest.spyOn(global.console, 'debug');

      const testMsg = 'aNewTest';
      const bot = new MusicBot({});

      bot.logger(LOG_DEBUG, testMsg, noFunc);

      expect(spy).toHaveBeenCalledTimes(0);

      spy.mockReset();
      spy.mockRestore();
    });
  });

  describe('setState()', () => {
    it('merges the `newState` into the existing state', () => {
      const bot = new MusicBot({});

      expect(bot.state).toEqual(defaultState);

      bot.setState({ music: 'bot' });

      expect(bot.state).toEqual({ ...defaultState, music: 'bot' });
    });
  });

  describe('resetState()', () => {
    it("resets the bot's state back to the default", () => {
      const bot = new MusicBot({});

      const initialState = bot.state;

      bot.setState({ thing: 'test' });

      expect(bot.state).toEqual({ ...defaultState, thing: 'test' });

      bot.resetState();

      expect(bot.state).toEqual(initialState);
    });
  });

  describe('setActiveVoiceConnection', () => {
    it('sets the active voice connection', () => {
      const expected = 'expected-value';

      const bot = new MusicBot({});

      bot.setActiveVoiceConnection(expected);

      expect(bot.activeVoiceConnection).toBe(expected);
    });
  });

  describe('resetActiveVoiceConnection', () => {
    it('clears the active voice connection and calls disconnect()', () => {
      const mockFn = jest.fn();
      const connection = { disconnect: mockFn };

      const bot = new MusicBot({});

      bot.activeVoiceConnection = connection;

      bot.resetActiveVoiceConnection();

      expect(mockFn.mock.calls.length).toBe(1);
      expect(bot.activeVoiceConnection).toBe(null);
    });

    it("does not call disconnect() on the connection if it's not set", () => {
      const bot = new MusicBot({});

      bot.activeVoiceConnection = null;

      bot.resetActiveVoiceConnection();

      expect(bot.activeVoiceConnection).toBe(null);
    });
  });

  describe('messageHandler()', () => {
    it('logs an error if the given key is not found in `messageString`', () => {
      const mockFn = jest.fn();

      const bot = new MusicBot({});

      bot.logger = mockFn;

      bot.messageHandler(SEND, 'TEST_STRING', {});

      expect(mockFn.mock.calls[0][1]).toBe("Failed to find message (string or function) with key 'TEST_STRING'");
    });

    it('logs an error if the given key is not found in `messageFunction`', () => {
      const mockFn = jest.fn();

      const TEST_STRING = 'test string';
      const bot = new MusicBot({ messageStrings: { TEST_STRING } });

      bot.logger = mockFn;

      bot.messageHandler(SEND, 'TEST_STRING', {});

      expect(mockFn.mock.calls[0][1]).toBe("Failed to find message (string or function) with key 'TEST_STRING'");
    });

    it('calls send on a message when type = `SEND`', () => {
      const mockFn = jest.fn();

      const bot = new MusicBot({});

      bot.messageHandler(SEND, 'UNKNOWN_COMMAND', { channel: { send: mockFn } });

      expect(mockFn.mock.calls[0][0]).toBe(defaultMessageStrings.UNKNOWN_COMMAND);
    });

    it('calls send on a message when type = `REPLY`', () => {
      const mockFn = jest.fn();

      const bot = new MusicBot({});

      bot.messageHandler(REPLY, 'UNKNOWN_COMMAND', { reply: mockFn });

      expect(mockFn.mock.calls[0][0]).toBe(defaultMessageStrings.UNKNOWN_COMMAND);
    });

    it('calls send on a message when type = `DIRECT_MESSAGE`', () => {
      const mockFn = jest.fn();

      const bot = new MusicBot({});

      bot.messageHandler(DIRECT_MESSAGE, 'UNKNOWN_COMMAND', {
        member: { createDM: () => ({ then: fn => fn({ send: mockFn }) }) },
      });

      expect(mockFn.mock.calls[0][0]).toBe(defaultMessageStrings.UNKNOWN_COMMAND);
    });

    it('logs an error when the type is unknown', () => {
      const mockFn = jest.fn();

      const bot = new MusicBot({});

      bot.logger = mockFn;

      bot.messageHandler('TEST_TYPE', 'UNKNOWN_COMMAND', {});

      expect(mockFn.mock.calls[0][1]).toBe("Unknown message return type 'TEST_TYPE'");
    });
  });

  describe('hasCommandPermission()', () => {
    it('uses the global permissions if the `userId` is not in the users list', () => {
      const bot = new MusicBot({});

      expect(bot.hasCommandPermission('1234', 'setUsername_command')).toBe(false);
    });

    it("uses the global permissions if the `userId` has a group but the group doesn't exist", () => {
      const bot = new MusicBot({
        permissions: {
          users: {
            '1234': 'agroup',
          },
        },
      });

      expect(bot.hasCommandPermission('1234', 'setUsername_command')).toBe(false);
    });

    it('returns the command permission for the group the given `userId` belongs to', () => {
      const bot = new MusicBot({
        permissions: {
          users: {
            '1234': 'agroup',
          },
          groups: {
            agroup: {
              setUsername_command: true,
            },
          },
        },
      });

      expect(bot.hasCommandPermission('1234', 'setUsername_command')).toBe(true);
    });
  });

  describe('commandHandler()', () => {
    it('logs an error if there is no command for the given key', () => {
      const mockFn = jest.fn();

      const bot = new MusicBot({});

      bot.logger = mockFn;

      bot.commandHandler('unknown_key', [], {});

      expect(mockFn.mock.calls[0][1]).toBe("Failed to find command with key 'unknown_key'");
    });

    it('logs a message and args used if the command exists', () => {
      const mockLogger = jest.fn();
      const mockMessageHandler = jest.fn();

      const bot = new MusicBot({});

      bot.logger = mockLogger;
      bot.messageHandler = mockMessageHandler;

      bot.commandHandler('setUsername_command', ['arg1', 'arg2', 'arg3'], { member: { displayName: 'test user' } });

      expect(mockLogger.mock.calls[0][1]).toBe(
        '\'test user\' called \'setUsername_command\' with ["arg1","arg2","arg3"]',
      );
    });

    it("logs a message and replies to the user if they don't have permission for the command", () => {
      const mockLogger = jest.fn();
      const mockMessageHandler = jest.fn();

      const bot = new MusicBot({});

      bot.logger = mockLogger;
      bot.messageHandler = mockMessageHandler;

      bot.commandHandler('setUsername_command', ['newName'], { member: { displayName: 'test user' } });

      expect(mockLogger.mock.calls[1][1]).toBe("'test user' does not have permission for 'setUsername_command'");
      expect(mockMessageHandler.mock.calls[0][1]).toBe('NO_PERMISSION');
    });

    it('runs the command if everything is okay', () => {
      const mockCommandRun = jest.fn();
      const mockLogger = jest.fn();
      const mockMessageHandler = jest.fn();

      const bot = new MusicBot({});

      class MockCommand extends Command {
        run() {
          mockCommandRun(this.args);
        }
      }

      bot.settings.commands.help_command = MockCommand;
      bot.logger = mockLogger;
      bot.messageHandler = mockMessageHandler;

      const args = ['arg1', 'arg2', 'arg3'];

      bot.commandHandler('help_command', args, { member: { displayName: 'test user' } });

      expect(mockCommandRun.mock.calls[0][0]).toBe(args);
    });
  });

  describe('onReady()', () => {
    it("throws an Error if the `serverId` isn't resolvable", () => {
      const serverId = 'test';
      const bot = new MusicBot({ serverId });

      let result;

      try {
        bot.onReady();
      } catch (e) {
        result = e;
      }

      expect(result.message).toBe(`Failed to connect to serverId '${serverId}'`);
    });

    it("throws an Error if the textChannelId isn't in the `server.channels`", () => {
      const textChannelId = 'test';
      const bot = new MusicBot({ serverId: 'test', textChannelId });

      bot.client.guilds.get = () => ({ channels: [] });

      let result;

      try {
        bot.onReady();
      } catch (e) {
        result = e;
      }

      expect(result.message).toBe(`Failed to find textChannelId '${textChannelId}'`);
    });

    it('will log a success message when it can connect', () => {
      const textChannelId = 'test';
      const bot = new MusicBot({ serverId: 'test', textChannelId });

      bot.client.guilds.get = () => ({ channels: [{ id: textChannelId, type: 'text' }] });

      const mockFn = jest.fn();
      bot.logger = mockFn;

      bot.onReady();

      expect(mockFn.mock.calls.length).toBe(1);
    });
  });

  describe('onMessage()', () => {
    it("should not reply to it's own messages", () => {
      const botUserId = 123;
      const channelId = 'test-channel';
      const mockFn = jest.fn();

      const bot = new MusicBot({});
      bot.client = { user: { id: botUserId } };
      bot.setState({ activeTextChannelId: channelId });

      const message = {
        author: { id: botUserId },
        channel: { id: channelId, send: mockFn },
      };

      bot.onMessage(message);

      expect(mockFn.mock.calls.length).toBe(0);
    });

    it('should not reply to messages in other channels', () => {
      const mockFn = jest.fn();

      const bot = new MusicBot({});
      bot.client = { user: { id: 123 } };
      bot.setState({ activeTextChannelId: 'test-channel' });

      const message = {
        author: { id: 456 },
        channel: { id: 'test-channel2', send: mockFn },
      };

      bot.onMessage(message);

      expect(mockFn.mock.calls.length).toBe(0);
    });

    it('should reply to the user if the bot was mentioned', () => {
      const channelId = 'test-channel';
      const mockMessageHandler = jest.fn();

      const bot = new MusicBot({});
      bot.messageHandler = mockMessageHandler;
      bot.client = { user: { id: 123 } };
      bot.setState({ activeTextChannelId: channelId });

      const message = {
        author: { id: 456 },
        channel: { id: channelId },
        isMentioned: () => true,
        content: 'hi there',
      };

      bot.onMessage(message);

      expect(mockMessageHandler.mock.calls.length).toBe(1);
    });

    it("will not do anything when it's just a message in the channel", () => {
      const channelId = 'test-channel';
      const mockMessageHandler = jest.fn();

      const bot = new MusicBot({});
      bot.messageHandler = mockMessageHandler;
      bot.client = { user: { id: 123 } };
      bot.setState({ activeTextChannelId: channelId });

      const message = {
        author: { id: 456 },
        channel: { id: channelId },
        isMentioned: () => false,
      };

      bot.onMessage(message);

      expect(mockMessageHandler.mock.calls.length).toBe(0);
    });

    describe('it should attempt to interpret the message as a command if the first character is the `COMMAND_PREFIX`', () => {
      it('should return the `UNKNOWN_COMMAND` message to the channel if the command was unknown', () => {
        const channelId = 'test-channel';
        const mockMessageHandler = jest.fn();

        const bot = new MusicBot({});
        bot.messageHandler = mockMessageHandler;
        bot.client = { user: { id: 123 } };
        bot.setState({ activeTextChannelId: channelId });

        const message = {
          author: { id: 456 },
          channel: { id: channelId },
          content: '!unknownCommand',
          isMentioned: () => false,
        };

        bot.onMessage(message);

        expect(mockMessageHandler.mock.calls[0][1]).toBe('UNKNOWN_COMMAND');
      });

      it("should call the command handler with the command's alias, args and the message", () => {
        const channelId = 'test-channel';
        const mockCommandHandler = jest.fn();

        const bot = new MusicBot({});
        bot.commandHandler = mockCommandHandler;
        bot.client = { user: { id: 123 } };
        bot.setState({ activeTextChannelId: channelId });

        const message = {
          author: { id: 456 },
          channel: { id: channelId },
          content: '!help arg1',
          isMentioned: () => false,
        };

        bot.onMessage(message);

        expect(mockCommandHandler.mock.calls[0][0]).toBe('help_command');
        expect(mockCommandHandler.mock.calls[0][1][0]).toBe('arg1');
        expect(mockCommandHandler.mock.calls[0][2]).toEqual(message);
      });
    });
  });

  describe('onDisconnect()', () => {
    it('calls the logger to log an error message to the console', () => {
      const spy = jest.spyOn(global.console, 'error');

      const error = { reason: 'testing', code: 0 };
      const bot = new MusicBot({});

      try {
        bot.onDisconnect(error);
      } catch (e) {} // eslint-disable-line

      expect(spy.mock.calls[0][1]).toBe(
        `Bot was disconnected from server.\nReason: ${error.reason}\nCode: ${error.code}`,
      );

      spy.mockReset();
      spy.mockRestore();
    });

    it('throws an Error when disconnected', () => {
      const error = { reason: 'testing', code: 0 };
      const bot = new MusicBot({});

      let result;

      try {
        bot.onDisconnect(error);
      } catch (e) {
        result = e;
      }

      expect(result.message).toBe('Bot was disconnected from server.');
    });
  });

  describe('run()', () => {
    it('throws an Error if a `token` is not provided', () => {
      const bot = new MusicBot({});

      let result;

      try {
        bot.run();
      } catch (e) {
        result = e;
      }

      expect(result.message).toBe("Failed to initialise: a 'token' was not provided in the config!");
    });

    it('throws an Error if a `serverId` is not provided', () => {
      const bot = new MusicBot({ token: 'abc' });

      let result;

      try {
        bot.run();
      } catch (e) {
        result = e;
      }

      expect(result.message).toBe("Failed to initialise: a 'serverId' was not provided in the config!");
    });

    it('throws an Error if a `textChannelId` is not provided', () => {
      const bot = new MusicBot({ token: 'abc', serverId: 'def' });

      let result;

      try {
        bot.run();
      } catch (e) {
        result = e;
      }

      expect(result.message).toBe("Failed to initialise: a 'textChannelId' was not provided in the config!");
    });

    it('registers the listener functions', () => {
      const bot = new MusicBot({ token: 'abc', serverId: 'def', textChannelId: 'ghi' });

      const mockFn = jest.fn();
      bot.client.on = mockFn;

      bot.run();

      expect(mockFn.mock.calls[0][0]).toBe('ready');
      expect(mockFn.mock.calls[0][1]).toBeInstanceOf(Function);

      expect(mockFn.mock.calls[1][0]).toBe('message');
      expect(mockFn.mock.calls[1][1]).toBeInstanceOf(Function);

      expect(mockFn.mock.calls[2][0]).toBe('disconnect');
      expect(mockFn.mock.calls[2][1]).toBeInstanceOf(Function);
    });

    it('calls `bot.login` if all is well', () => {
      const token = 'abc';
      const bot = new MusicBot({ token, serverId: 'def', textChannelId: 'ghi' });

      const mockFn = jest.fn();
      bot.client.login = mockFn;

      bot.run();

      expect(mockFn.mock.calls.length).toBe(1);
      expect(mockFn.mock.calls[0][0]).toBe(token);
    });
  });
});
