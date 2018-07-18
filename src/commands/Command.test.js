const Command = require('./Command');

describe('Command', () => {
  describe('constructor()', () => {
    it('behaves as expected', () => {
      const bot = 'bot';
      const args = 'args';
      const message = 'message';

      const Cmd = new Command(bot, args, message);

      expect(Cmd.bot).toBe(bot);
      expect(Cmd.args).toBe(args);
      expect(Cmd.message).toBe(message);
    });
  });
});
