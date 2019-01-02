const dateFormat = require('dateformat');

const findCommandKeyByAlias = (commandDetails, givenAlias) => {
  let commandKey = null;

  Object.keys(commandDetails).forEach(key => {
    if (commandDetails[key].aliases.includes(givenAlias.toLowerCase())) {
      commandKey = key;
      return; // eslint-disable-line no-useless-return
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
