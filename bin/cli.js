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
    admin: {
      type: 'string',
      alias: 'a',
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
      discord-music-bot [arguments]

    Required Arguments:
      --token, -t       Your Discord token.
      --server, -s      The id of the server you want to join.
      --channel, -c     The id of the channel you want to listen for commands in.
      --admin, -a       The user id of a Discord account that should have admin permissions. Pass the arg multiple times to add multiple users.

    Optional Arguments:
      --debug, -d       Enable debug mode (aka, way more logging).
`,
  cliOptions,
);

const users = {};

if (Array.isArray(cli.flags.admin)) {
  cli.flags.admin.forEach(id => {
    users[id] = 'admin';
  });
} else if (typeof cli.flags.admin === 'string') {
  users[cli.flags.admin] = 'admin';
}

const musicBot = new MusicBot({
  token: cli.flags.token,
  serverId: cli.flags.server,
  textChannelId: cli.flags.channel,
  permissions: { users },
  debug: cli.flags.debug,
});

musicBot.run();
