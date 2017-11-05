const URL = require('url-parse');

const util = require('../../util/util.js');

const commandGroup = 'playCommand';

const YOUTUBE = 'youtube';
const SPOTIFY = 'spotify';
const UNKNOWN = 'unknown';

const getUrlProvider = (url) => {
  if (url.hostname.indexOf('spotify') !== -1) {
    return SPOTIFY;
  } else if (url.hostname.indexOf('youtube') !== -1 || url.hostname.indexOf('youtu.be') !== -1) {
    return YOUTUBE;
  }

  return UNKNOWN;
};

const handleSpotifyUrl = (musicbot, msg, url) => {
  const path = url.pathname.split('/');

  if (path[2] === 'playlist') {
    musicbot.queueSpotifyPlaylist(path[1], path[3]);
  } else if (path[0] === 'track') {
    musicbot.queueSpotifyTrack(path[1]);
  } else {
    msg.reply(musicbot.getReplyMsg(commandGroup, 'unknownPlayUrl'));
  }
};

const handleYoutubeUrl = (musicbot, msg, url) => {
  if (url.query.indexOf('list=') !== -1) {
    const id = util.getYoutubePlaylistId(url.href);
    musicbot.queueYoutubePlaylist(id);
  } else {
    const id = util.getYoutubeVideoId(url.href);
    musicbot.queueYoutubeVideo(id);
  }
};

/**
 * Play command.
 *
 * Queues a given video/track/playlist to the connected voice channel.
 *
 * @param {object} musicbot - The musicbot.
 * @param {object} msg      - The message object that called the command.
 * @param {array}  args     - List of arugments.
 */
const run = function run(musicbot, msg, args) {
  if (musicbot.activeVoiceChannel == null || musicbot.activeVoiceConnection == null) {
    msg.reply(musicbot.getReplyMsg(commandGroup, 'notConnectedToVoice'));
    return;
  }

  if (msg.member.voiceChannel !== musicbot.activeVoiceChannel) {
    msg.reply(musicbot.getReplyMsg(commandGroup, 'notInSendersChannel'));
    return;
  }

  const inputUrl = new URL(args[0]);

  switch (getUrlProvider(inputUrl)) {
    case SPOTIFY:
      handleSpotifyUrl(musicbot, msg, inputUrl);
      break;
    case YOUTUBE:
      handleYoutubeUrl(musicbot, msg, inputUrl);
      break;
    default:
      msg.reply(musicbot.getReplyMsg(commandGroup, 'unknownPlayUrl'));
  }
};

const info = {
  name: 'Play',
  aliases: ['play', 'p'],
  usage: 'play <url>',
  description: 'Play a given Youtube or Spotify URL. Supports videos, tracks and playlists.',
  permission: 'play',
};

module.exports = {
  info,
  run,
};
