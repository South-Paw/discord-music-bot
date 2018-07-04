const dateFormat = require('dateformat');

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

const getLoggerPrefix = level => {
  const time = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:l');
  return `[${time}] (${level.toUpperCase()})`;
};

module.exports = {
  findCommandKeyByAlias,
  getLoggerPrefix,
};
