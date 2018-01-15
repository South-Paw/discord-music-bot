const { RichEmbed } = require('discord.js');
const ytdl = require('ytdl-core');

/**
 * Convert a number of seconds into a hh:mm:ss timestamp.
 *
 * @param  {number} seconds - The number of seconds to convert.
 * @return {string}         - The seconds converted to an hh:mm:ss. If no hours in result it will
 *                            return mm:ss instead.
 */
const secondsToTimestamp = (seconds) => {
  const secondsFloor = seconds > 0 ? seconds : 0;
  const hours = Math.floor(secondsFloor / 3600);
  let mins = `0${Math.floor((secondsFloor % 3600) / 60)}`;
  let secs = `0${Math.floor((secondsFloor % 60))}`;

  mins = mins.substr(mins.length - 2);
  secs = secs.substr(secs.length - 2);

  // eslint-disable-next-line
  if (!isNaN(seconds)) {
    if (hours) {
      return `${hours}:${mins}:${secs}`;
    }
    return `${mins}:${secs}`;
  }
  return '00:00';
};

/**
 * Get the details of Youtube video by id and return it in a special object for the bot.
 *
 * @param  {string} requestor - The user who requested the Youtube video.
 * @param  {string} videoId   - The id of the video to get with ytdl.
 * @return {object}           - After resolving a promise, returns an object with the videos title,
 *                              image, url, duration (in seconds), requestedBy, source and
 *                              sourceImage.
 */
const getYoutubeVideoDetails = (requestor, videoId) => new Promise((resolve) => {
  ytdl.getInfo(
    videoId,
    (error, info) => {
      resolve({
        title: info.title,
        image: info.iurlmaxres,
        url: info.video_url,
        duration: info.length_seconds,
        requestedBy: requestor,
        source: 'Youtube',
        sourceImage: 'https://i.imgur.com/nZ5aw5i.png',
      });
    },
  );
});

/**
 * Given a url, will return the Youtube video id.
 *
 * Looks for the following matches:
 *  youtu.be/<id>
 *  ?v=<id>
 *  &v=<id>
 *  embed/<id>
 *  /v/<id>
 *
 * @param  {string} url  - The url to extract the id from.
 * @return {string|null} - The first instance of the id extracted from the url or null if none was
 *                         found.
 */
const getYoutubeVideoId = (url) => {
  const patterns = [
    /youtu\.be\/([^#&?]{11})/,
    /\?v=([^#&?]{11})/,
    /&v=([^#&?]{11})/,
    /embed\/([^#&?]{11})/,
    /\/v\/([^#&?]{11})/,
  ];

  if (/youtu\.?be/.test(url)) {
    // If any pattern matches, return the ID
    for (let i = 0; i < patterns.length; i += 1) {
      if (patterns[i].test(url)) {
        return patterns[i].exec(url)[1];
      }
    }
  }

  return null;
};

/**
 * Given a url, will return the Youtube playlist id.
 *
 * Looks for the following matches:
 *  ?list=<id>
 *  &list=<id>
 *
 * TODO: unsure if this is all possible playlist urls... but I can't find a good list online.
 *
 * @param  {string} url  - The url to extract the id from.
 * @return {string|null} - The first instance of the id extracted from the url or null if none was
 *                         found.
 */
const getYoutubePlaylistId = (url) => {
  const patterns = [
    /\?list=([^#&?]{24})/,
    /&list=([^#&?]{24})/,
  ];

  if (/youtu\.?be/.test(url)) {
    // If any pattern matches, return the ID
    for (let i = 0; i < patterns.length; i += 1) {
      if (patterns[i].test(url)) {
        return patterns[i].exec(url)[1];
      }
    }
  }

  return null;
};

/**
 * Returns a RichEmbed of the now playing song.
 *
 * @param  {string} title       - Song title.
 * @param  {string} image       - Song image.
 * @param  {string} url         - Url of song source.
 * @param  {string} duration    - Duration of song in seconds.
 * @param  {string} requestedBy - User that requested the song.
 * @param  {string} source      - Playback source.
 * @param  {string} sourceImage - Playback source logo/image.
 * @return {RichEmbed}          - The embed to be sent back to the activeTextChannel.
 */
const getNowPlayingEmbed = ({
  title,
  image,
  url,
  duration,
  requestedBy,
  source,
  sourceImage,
}) => {
  const embed = new RichEmbed()
    .setAuthor(`Now Playing (via ${source})`, sourceImage)
    .setTitle(title)
    .setDescription(`Length: ${secondsToTimestamp(parseInt(duration, 10))}`)
    .setImage(image)
    .setURL(url)
    .setFooter(`Requested by ${requestedBy}`);

  return embed;
};

module.exports = {
  secondsToTimestamp,
  getYoutubeVideoDetails,
  getYoutubeVideoId,
  getYoutubePlaylistId,
  getNowPlayingEmbed,
};
