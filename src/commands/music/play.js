const URL = require('url-parse');
const util = require('../../util/util.js');

const COMMAND_GROUP = 'playCommand';

const YOUTUBE = 'youtube';
const SPOTIFY = 'spotify';
const UNKNOWN = 'unknown';

/**
 * Figures out what supported provider the URL is for.
 *
 * @param  {string} url - The given url.
 * @return {string}     - The name of the provider as a string or 'unknown' if none.
 */
const getUrlProvider = (url) => {
  if (url.hostname.indexOf('spotify') !== -1) {
    return SPOTIFY;
  } else if (url.hostname.indexOf('youtube') !== -1 || url.hostname.indexOf('youtu.be') !== -1) {
    return YOUTUBE;
  }

  return UNKNOWN;
};

/**
 * Handles a spotify url. Decides if it's a playlist or not, then breaks it up and grabs the
 * important parts.
 *
 * @param {object} musicbot - The musicbot.
 * @param {object} msg      - The message object that called the command.
 * @param {string} url      - The given spotify url.
 */
const handleSpotifyUrl = (musicbot, msg, url) => {
  const path = url.pathname.split('/');

  if (path[2] === 'playlist') {
    const playlistOwner = path[1];
    const playlistId = path[3];

    musicbot.queueSpotifyPlaylist(msg, playlistOwner, playlistId);
  } else if (path[0] === 'track') {
    const trackId = path[1];

    musicbot.queueSpotifyTrack(msg, trackId);
  } else {
    msg.reply(musicbot.getReplyMsg(COMMAND_GROUP, 'unknownPlayUrl'));
  }
};

/**
 * Handles a youtube url. Decides if it's a playlist or not, then breaks it up and grabs the
 * important parts.
 *
 * @param {object} musicbot - The musicbot.
 * @param {object} msg      - The message object that called the command.
 * @param {string} url      - The given youtube url.
 */
const handleYoutubeUrl = (musicbot, msg, url) => {
  if (url.query.indexOf('list=') !== -1) {
    const playlistId = util.getYoutubePlaylistId(url.href);

    musicbot.queueYoutubePlaylist(msg, playlistId);
  } else {
    const videoId = util.getYoutubeVideoId(url.href);

    musicbot.queueYoutubeVideo(msg, videoId);
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
    msg.reply(musicbot.getReplyMsg(COMMAND_GROUP, 'notConnectedToVoice'));
    return;
  }

  if (msg.member.voiceChannel !== musicbot.activeVoiceChannel) {
    msg.reply(musicbot.getReplyMsg(COMMAND_GROUP, 'notInSendersChannel'));
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
      msg.reply(musicbot.getReplyMsg(COMMAND_GROUP, 'unknownPlayUrl'));
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
