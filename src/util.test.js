const { findCommandKeyByAlias } = require('./util');

const { commandKeys } = require('./config/commands');

describe('Utilities', () => {
  describe('findCommandKeyByAlias()', () => {
    it('returns null when an unknown command key is given', () => {
      expect(findCommandKeyByAlias('abc')).toBe(null);
    });

    it('returns the correct command key when a valid alias is given', () => {
      expect(findCommandKeyByAlias('help')).toBe(commandKeys.HELP_COMMAND);
    });

    it('returns the correct command key when a valid uppercase alias is given', () => {
      expect(findCommandKeyByAlias('HELP')).toBe(commandKeys.HELP_COMMAND);
    });
  });
});
