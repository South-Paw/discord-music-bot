/* eslint-env jest */
const { RichEmbed } = require('discord.js');
const {
  secondsToTimestamp,
  getYoutubeVideoId,
  getYoutubePlaylistId,
  getNowPlayingEmbed,
} = require('./util');

describe('Util functions', () => {
  describe('secondsToTimestamp()', () => {
    test('it sensibly handles invalid values', () => {
      expect(secondsToTimestamp('test')).toBe('00:00');
    });

    test('it sensibly handles negative seconds', () => {
      expect(secondsToTimestamp(-1)).toBe('00:00');
    });

    test('it handles decimal seconds', () => {
      expect(secondsToTimestamp(0.56978597)).toBe('00:00');
    });

    test('it handles decimal zero seconds', () => {
      expect(secondsToTimestamp(0.00)).toBe('00:00');
    });

    test('it handles zero seconds', () => {
      expect(secondsToTimestamp(0)).toBe('00:00');
    });

    test('it handles a single second', () => {
      expect(secondsToTimestamp(1)).toBe('00:01');
    });

    test('it handles a minute', () => {
      expect(secondsToTimestamp(60)).toBe('01:00');
    });

    test('it handles small minutes', () => {
      expect(secondsToTimestamp(120)).toBe('02:00');
    });

    test('it handles larger minutes', () => {
      expect(secondsToTimestamp(680)).toBe('11:20');
    });

    test('it handles even larger minutes (40 minutes)', () => {
      expect(secondsToTimestamp(2420)).toBe('40:20');
    });

    test('it handles hours', () => {
      expect(secondsToTimestamp(4800)).toBe('1:20:00');
    });

    test('it handles larger hours', () => {
      expect(secondsToTimestamp(14400)).toBe('4:00:00');
    });
  });

  describe('getYoutubeVideoId()', () => {
    const expectedVideoId = 'bKYwzLAVqhY';

    test('invalid url returns null', () => {
      expect(getYoutubeVideoId(`http://google.com/?v=${expectedVideoId}`)).toBeNull();
    });

    test('a url with youtu.be', () => {
      expect(getYoutubeVideoId(`http://youtu.be/${expectedVideoId}`)).toBe(expectedVideoId);
    });

    test('a url with youtu.be with # after', () => {
      expect(getYoutubeVideoId(`http://youtu.be/${expectedVideoId}#t=0m10s`)).toBe(expectedVideoId);
    });

    test('a url with ?v=', () => {
      expect(getYoutubeVideoId(`http://www.youtube.com/watch?v=${expectedVideoId}`)).toBe(expectedVideoId);
    });

    test('a url with ?v= and & after', () => {
      expect(getYoutubeVideoId(`http://www.youtube.com/watch?v=${expectedVideoId}&test=abc`)).toBe(expectedVideoId);
    });

    test('a url with ?v= and # after', () => {
      expect(getYoutubeVideoId(`http://www.youtube.com/watch?v=${expectedVideoId}#t=0m10s`)).toBe(expectedVideoId);
    });

    test('a url with &v=', () => {
      expect(getYoutubeVideoId(`http://www.youtube.com/watch?list=UULTZddgA_La9H4Ngg99t_QQ&v=${expectedVideoId}`)).toBe(expectedVideoId);
    });

    test('a url with &v= and # after', () => {
      expect(getYoutubeVideoId(`http://www.youtube.com/watch?list=UULTZddgA_La9H4Ngg99t_QQ&v=${expectedVideoId}#t=0m10s`)).toBe(expectedVideoId);
    });

    test('a url with &v= and & after', () => {
      expect(getYoutubeVideoId(`http://www.youtube.com/watch?list=UULTZddgA_La9H4Ngg99t_QQ&v=${expectedVideoId}&test=abc`)).toBe(expectedVideoId);
    });

    test('a url with embed', () => {
      expect(getYoutubeVideoId(`http://www.youtube.com/embed/${expectedVideoId}`)).toBe(expectedVideoId);
    });

    test('a url with embed with ? after', () => {
      expect(getYoutubeVideoId(`http://www.youtube.com/embed/${expectedVideoId}?rel=0`)).toBe(expectedVideoId);
    });

    test('a url with embed with # after', () => {
      expect(getYoutubeVideoId(`http://www.youtube.com/embed/${expectedVideoId}#t=0m10s`)).toBe(expectedVideoId);
    });

    test('a url with /v/', () => {
      expect(getYoutubeVideoId(`http://www.youtube.com/v/${expectedVideoId}`)).toBe(expectedVideoId);
    });

    test('a url with /v/ with # after', () => {
      expect(getYoutubeVideoId(`http://www.youtube.com/v/${expectedVideoId}#t=0m10s`)).toBe(expectedVideoId);
    });

    test('a url with /v/ with ? after', () => {
      expect(getYoutubeVideoId(`http://www.youtube.com/v/${expectedVideoId}?fs=1`)).toBe(expectedVideoId);
    });

    test('a url with /v/ with a mix of stuff after it', () => {
      expect(getYoutubeVideoId(`http://www.youtube.com/v/${expectedVideoId}?fs=1&amp;hl=en_US&amp;rel=0`)).toBe(expectedVideoId);
    });
  });

  describe('getYoutubePlaylistId()', () => {
    const expectedPlaylistId = 'UULTZddgA_La9H4Ngg99t_QQ';

    test('invalid url returns null', () => {
      expect(getYoutubePlaylistId(`http://google.com/?list=${expectedPlaylistId}`)).toBeNull();
    });

    test('a url with ?list=', () => {
      expect(getYoutubePlaylistId(`http://www.youtube.com/?list=${expectedPlaylistId}`)).toBe(expectedPlaylistId);
    });

    test('a url with ?list= with # after', () => {
      expect(getYoutubePlaylistId(`http://www.youtube.com/?list=${expectedPlaylistId}#testId`)).toBe(expectedPlaylistId);
    });

    test('a url with ?list= with & after', () => {
      expect(getYoutubePlaylistId(`http://www.youtube.com/?list=${expectedPlaylistId}&v=Qe4s5fYZ49U`)).toBe(expectedPlaylistId);
    });

    test('a url with &list=', () => {
      expect(getYoutubePlaylistId(`http://www.youtube.com/?v=Qe4s5fYZ49U&list=${expectedPlaylistId}`)).toBe(expectedPlaylistId);
    });

    test('a url with &list= with # after', () => {
      expect(getYoutubePlaylistId(`http://www.youtube.com/?v=Qe4s5fYZ49U&list=${expectedPlaylistId}#t=0m10s`)).toBe(expectedPlaylistId);
    });

    test('a url with &list= with & after', () => {
      expect(getYoutubePlaylistId(`http://www.youtube.com/?v=Qe4s5fYZ49U&list=${expectedPlaylistId}&rel=0`)).toBe(expectedPlaylistId);
    });
  });

  describe('getNowPlayingEmbed', () => {
    const nowPlayingObject = {
      title: 'title',
      image: 'image',
      url: 'url',
      duration: '123',
      requestedBy: 'requestedBy',
      source: 'source',
      sourceImage: 'sourceImage',
    };

    test('a valid now playing object creates an embed', () => {
      const embed = getNowPlayingEmbed(nowPlayingObject);

      expect(embed).toBeInstanceOf(RichEmbed);

      expect(embed.author.name).toBe(`Now Playing (via ${nowPlayingObject.source})`);
      expect(embed.author.icon_url).toBe(nowPlayingObject.sourceImage);
      expect(embed.title).toBe(nowPlayingObject.title);
      expect(embed.description).toBe(`Length: ${secondsToTimestamp(parseInt(nowPlayingObject.duration, 10))}`);
      expect(embed.image.url).toBe(nowPlayingObject.image);
      expect(embed.url).toBe(nowPlayingObject.url);
      expect(embed.footer.text).toBe(`Requested by ${nowPlayingObject.requestedBy}`);
    });
  });
});
