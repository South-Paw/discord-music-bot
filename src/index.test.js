const MusicBot = require('./index');
const { LOG_INFO, LOG_WARN, LOG_ERROR, LOG_DEBUG, SEND, REPLY, DIRECT_MESSAGE } = require('./constants');
const { defaultMessageStrings } = require('./defaults/messages');

const defaultState = {
  activeTextChannel: null,
};

describe('MusicBot', () => {
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

  xdescribe('hasCommandPermission()', () => {});

  xdescribe('commandHandler()', () => {});

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

      bot.bot.guilds.get = () => ({ channels: [] });

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

      bot.bot.guilds.get = () => ({ channels: [{ id: textChannelId, type: 'text' }] });

      const mockFn = jest.fn();
      bot.logger = mockFn;

      bot.onReady();

      expect(mockFn.mock.calls.length).toBe(1);
    });
  });

  describe('onMessage()', () => {
    it("should not reply to it's own messages", () => {
      const botUserId = 123;
      const channelName = 'test-channel';
      const mockFn = jest.fn();

      const bot = new MusicBot({});
      bot.bot = { user: { id: botUserId } };
      bot.setState({ activeTextChannel: { name: channelName } });

      const message = {
        author: { id: botUserId },
        channel: { name: channelName, send: mockFn },
      };

      bot.onMessage(message);

      expect(mockFn.mock.calls.length).toBe(0);
    });

    it('should not reply to messages in other channels', () => {
      const mockFn = jest.fn();

      const bot = new MusicBot({});
      bot.bot = { user: { id: 123 } };
      bot.setState({ activeTextChannel: { name: 'test-channel' } });

      const message = {
        author: { id: 456 },
        channel: { name: 'test-channel2', send: mockFn },
      };

      bot.onMessage(message);

      expect(mockFn.mock.calls.length).toBe(0);
    });

    it('should reply to the user if the bot was mentioned', () => {
      const channelName = 'test-channel';
      const mockMessageHandler = jest.fn();

      const bot = new MusicBot({});
      bot.messageHandler = mockMessageHandler;
      bot.bot = { user: { id: 123 } };
      bot.setState({ activeTextChannel: { name: channelName } });

      const message = {
        author: { id: 456 },
        channel: { name: channelName },
        isMentioned: () => true,
        content: 'hi there',
      };

      bot.onMessage(message);

      expect(mockMessageHandler.mock.calls.length).toBe(1);
    });

    it("will not do anything when it's just a message in the channel", () => {
      const channelName = 'test-channel';
      const mockMessageHandler = jest.fn();

      const bot = new MusicBot({});
      bot.messageHandler = mockMessageHandler;
      bot.bot = { user: { id: 123 } };
      bot.setState({ activeTextChannel: { name: channelName } });

      const message = {
        author: { id: 456 },
        channel: { name: channelName },
        isMentioned: () => false,
      };

      bot.onMessage(message);

      expect(mockMessageHandler.mock.calls.length).toBe(0);
    });

    describe('it should attempt to interpret the message as a command if the first character is the `COMMAND_PREFIX`', () => {
      it('should return the `UNKNOWN_COMMAND` message to the channel if the command was unknown', () => {
        const channelName = 'test-channel';
        const mockMessageHandler = jest.fn();

        const bot = new MusicBot({});
        bot.messageHandler = mockMessageHandler;
        bot.bot = { user: { id: 123 } };
        bot.setState({ activeTextChannel: { name: channelName } });

        const message = {
          author: { id: 456 },
          channel: { name: channelName },
          content: '!unknownCommand',
          isMentioned: () => false,
        };

        bot.onMessage(message);

        expect(mockMessageHandler.mock.calls[0][1]).toBe('UNKNOWN_COMMAND');
      });

      it("should call the command handler with the command's alias, args and the message", () => {
        const channelName = 'test-channel';
        const mockCommandHandler = jest.fn();

        const bot = new MusicBot({});
        bot.commandHandler = mockCommandHandler;
        bot.bot = { user: { id: 123 } };
        bot.setState({ activeTextChannel: { name: channelName } });

        const message = {
          author: { id: 456 },
          channel: { name: channelName },
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
      bot.bot.on = mockFn;

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
      bot.bot.login = mockFn;

      bot.run();

      expect(mockFn.mock.calls.length).toBe(1);
      expect(mockFn.mock.calls[0][0]).toBe(token);
    });
  });
});
