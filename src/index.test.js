const MusicBot = require('./index');

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
    xit('defaults to `console.log`', () => {
      expect(false).toBeTruthy();
    });

    xit('uses `console.info` for `LOG_INFO`', () => {
      expect(false).toBeTruthy();
    });

    xit('uses `console.warn` for `LOG_WARN`', () => {
      expect(false).toBeTruthy();
    });

    xit('uses `console.error` for `LOG_ERROR`', () => {
      expect(false).toBeTruthy();
    });

    xit('uses `console.debug` for `LOG_DEBUG` when `isDebug()=true`', () => {
      expect(false).toBeTruthy();
    });

    xit('blocks the `console.debug` for `LOG_DEBUG` when `isDebug=false`', () => {
      expect(false).toBeTruthy();
    });
  });

  describe('getMessage()', () => {
    it('throws an Error if the key is not found', () => {
      const key = 'test';
      const bot = new MusicBot({});

      let error;

      try {
        bot.getMessage(key);
      } catch (e) {
        error = e;
      }

      expect(error.message).toBe(`Failed to get message with key '${key}'`);
    });

    xit('retrieves the key if valid', () => {
      expect(false).toBeTruthy();
    });
  });

  describe('getPreference()', () => {
    it('throws an Error if the key is not found', () => {
      const key = 'test';
      const bot = new MusicBot({});

      let error;

      try {
        bot.getPreference(key);
      } catch (e) {
        error = e;
      }

      expect(error.message).toBe(`Failed to get preference with key '${key}'`);
    });

    xit('retrieves the key if valid', () => {
      expect(false).toBeTruthy();
    });
  });

  describe('setState()', () => {
    it('merges the `newState` into the existing state', () => {
      const bot = new MusicBot({});

      expect(bot.state).toEqual({});

      bot.setState({ music: 'bot' });

      expect(bot.state).toEqual({ music: 'bot' });
    });
  });

  describe('resetState()', () => {
    it('resets the bot\'s state back to the default', () => {
      const bot = new MusicBot({});

      const initialState = bot.state;

      bot.setState({ thing: 'test' });

      expect(bot.state).toEqual({ thing: 'test' });

      bot.resetState();

      expect(bot.state).toEqual(initialState);
    });
  });

  describe('onReady()', () => {
    it('throws an Error if the `serverId` isn\'t resolvable', () => {
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

    it('throws an Error if the textChannelId isn\'t in the `server.channels`', () => {
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

  xdescribe('onMessage()', () => {
    it('', () => {
    });
  });

  xdescribe('onDisconnect()', () => {
    it('logs an error message to the console', () => {
    });

    it('throws an Error when disconnected', () => {
    });
  });

  describe('init()', () => {
    it('throws an Error if a `token` is not provided', () => {
      const bot = new MusicBot({});

      let result;

      try {
        bot.init();
      } catch (e) {
        result = e;
      }

      expect(result.message).toBe('Failed to initialise: a \'token\' was not provided in the config!');
    });

    it('throws an Error if a `serverId` is not provided', () => {
      const bot = new MusicBot({ token: 'abc' });

      let result;

      try {
        bot.init();
      } catch (e) {
        result = e;
      }

      expect(result.message).toBe('Failed to initialise: a \'serverId\' was not provided in the config!');
    });

    it('throws an Error if a `textChannelId` is not provided', () => {
      const bot = new MusicBot({ token: 'abc', serverId: 'def' });

      let result;

      try {
        bot.init();
      } catch (e) {
        result = e;
      }

      expect(result.message).toBe('Failed to initialise: a \'textChannelId\' was not provided in the config!');
    });

    it('registers the listener functions', () => {
      const bot = new MusicBot({ token: 'abc', serverId: 'def', textChannelId: 'ghi' });

      const mockFn = jest.fn();
      bot.bot.on = mockFn;

      bot.init();

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

      bot.init();

      expect(mockFn.mock.calls.length).toBe(1);
      expect(mockFn.mock.calls[0][0]).toBe(token);
    });
  });
});
