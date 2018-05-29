const { commandAliases } = require('./config/commands');

const findCommandKeyByAlias = givenAlias => {
  let commandKey = null;

  Object.keys(commandAliases).forEach(key => {
    if (commandAliases[key].includes(givenAlias.toLowerCase())) {
      commandKey = key;
    }
  });

  return commandKey;
};

module.exports = {
  findCommandKeyByAlias,
};
