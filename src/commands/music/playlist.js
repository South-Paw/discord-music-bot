const COMMAND_GROUP = 'playlistCommand';

function itemsToString(messageItems) {
  let message = '';

  messageItems.forEach((item) => {
    message += `\`${item.playlistId.toString()}\``;
    message += ` **${item.title}**`;
    message += ` (requested by ${item.requestedBy})\n`;
  });

  return message;
}

/**
 * Playlist command.
 *
 * Replies with the current playlist for the bot.
 *
 * @param {object} musicbot - The musicbot.
 * @param {object} msg      - The message object that called the command.
 * @param {array}  args     - List of arugments.
 */
const run = function run(musicbot, msg, args) { // eslint-disable-line
  if (!musicbot.isQueueEmpty()) {
    const maxItemsInMessage = 30;
    let messageItems = [];

    msg.reply(musicbot.getReplyMsg(COMMAND_GROUP, 'currentPlaylist'));

    musicbot.playlistQueue.forEach((item, i) => {
      if (maxItemsInMessage === messageItems.length) {
        musicbot.activeTextChannel.send(itemsToString(messageItems));

        messageItems = [];
      }

      const song = item;
      song.playlistId = i + 1;
      messageItems.push(song);
    });

    if (messageItems.length > 0) {
      musicbot.activeTextChannel.send(itemsToString(messageItems));
    }
  } else {
    msg.reply(musicbot.getReplyMsg(COMMAND_GROUP, 'queueIsEmpty'));
  }
};

const info = {
  name: 'Playlist',
  aliases: ['playlist', 'queue'],
  usage: 'playlist',
  description: 'Shows the current playlist for the bot.',
  permission: 'playlist',
};

module.exports = {
  info,
  run,
};
