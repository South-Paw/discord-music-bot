const COMMAND_GROUP = 'resumeCommand';

/**
 * Resume command.
 *
 * Resumes from a paused or stopped state.
 *
 * @param {object} musicbot - The musicbot.
 * @param {object} msg      - The message object that called the command.
 * @param {array}  args     - List of arugments.
 */
const run = function run(musicbot, msg, args) { // eslint-disable-line
  if (musicbot.activeVoiceChannel == null || musicbot.activeVoiceConnection == null) {
    msg.reply(musicbot.getReplyMsg(COMMAND_GROUP, 'notConnectedToVoice'));
    return;
  }

  if (msg.member.voiceChannel !== musicbot.activeVoiceChannel) {
    msg.reply(musicbot.getReplyMsg(COMMAND_GROUP, 'notInSendersChannel'));
    return;
  }

  if (musicbot.isPlaybackStopped()) {
    musicbot.setPlaybackStopped(false);

    if (!musicbot.isQueueEmpty()) {
      musicbot.playNextSong();
    }
  } else if (musicbot.isPlaybackPaused()) {
    musicbot.voiceHandler.resume();
    musicbot.setPlaybackPaused(false);
    musicbot.setBotNowPlaying(`${musicbot.nowPlaying.title}`);
    msg.reply('Resuming!');
  } else {
    msg.reply(musicbot.getReplyMsg(COMMAND_GROUP, 'alreadyPlaying'));
  }
};

const info = {
  name: 'Resume',
  aliases: ['resume'],
  usage: 'resume',
  description: 'Resumes from a paused or stopped state.',
  permission: 'resume',
};

module.exports = {
  info,
  run,
};
