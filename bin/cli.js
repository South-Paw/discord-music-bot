#!/usr/bin/env node

const meow = require('meow');
const MusicBot = require('../src/index.js');

const cliOptions = {
  flags: {
    token: {
      type: 'string',
      alias: 't',
    },
    server: {
      type: 'string',
      alias: 's',
    },
    channel: {
      type: 'string',
      alias: 'c',
    },
    debug: {
      type: 'boolean',
      alias: 'd',
    },
  },
};

const cli = meow(
  `
    Usage:
      discord-musicbot [options]

    Required Arguments:
      --token, -t       Your Discord token.
      --server, -s      The id of the server you want to join.
      --channel, -c     The id of the channel you want to listen for commands in.

    Optional Arguments:
      --debug, -d       Enable debug mode (aka, way more logging).
`,
  cliOptions,
);

if (cli.flags.token) {
  // load config from file optionally...?

  const musicBot = new MusicBot({
    token: cli.flags.token,
    serverId: cli.flags.server,
    textChannelId: cli.flags.channel,
    debug: cli.flags.debug,
  });

  musicBot.run();
}
