const BOT_MENTIONED = 'bot_mentioned';
const UNKNOWN_COMMAND = 'unknown_command';

const messageConstants = {
  BOT_MENTIONED,
  UNKNOWN_COMMAND,
};

const defaultMessages = {
  [BOT_MENTIONED]: 'Hey {}, you should try `{}` for a list of commands. :thumbsup:',
  [UNKNOWN_COMMAND]: "Hmmm. I couldn't find that command... did you mistype it?",
};

module.exports = {
  messageConstants,
  defaultMessages,
};
