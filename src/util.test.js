const { findCommandKeyByAlias } = require('./util');

describe('Utilities', () => {
  describe('findCommandKeyByAlias()', () => {
    it('returns null when an unknown command key is given', () => {
      expect(findCommandKeyByAlias({ def: { aliases: ['def'] } }, 'abc')).toBe(null);
    });

    it('returns the correct command key when a valid alias is given', () => {
      expect(findCommandKeyByAlias({ help_key: { aliases: ['help'] } }, 'help')).toBe('help_key');
    });

    it('returns the correct command key when a valid uppercase alias is given', () => {
      expect(findCommandKeyByAlias({ help_key: { aliases: ['help'] } }, 'HELP')).toBe('help_key');
    });
  });

  xdescribe('getLoggerPrefix()', () => {
    it('returns the logger prefix', () => {});
  });
});
