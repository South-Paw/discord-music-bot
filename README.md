# Discord Music Bot

🎧 A music bot for Discord servers, self-hosted and easy to use.

[![discord-musicbot on npm](https://nodei.co/npm/discord-musicbot.png)](https://nodei.co/npm/discord-musicbot/)

[![CI Status](https://img.shields.io/travis/South-Paw/discord-music-bot.svg)](https://travis-ci.org/South-Paw/discord-music-bot)
[![Coveralls Status](https://img.shields.io/coveralls/github/South-Paw/discord-music-bot.svg)](https://coveralls.io/github/South-Paw/discord-music-bot)
[![Dependencies](https://david-dm.org/South-Paw/discord-music-bot.svg)](https://david-dm.org/South-Paw/discord-music-bot)
[![Dev Dependencies](https://david-dm.org/South-Paw/discord-music-bot/dev-status.svg)](https://david-dm.org/South-Paw/discord-music-bot?type=dev)

---

**Note: This is still very much a work-in-progress and will contain bugs!**

* Documentation will be added when there's something a bit more tangible to use.
* A `v1.0.0` release will be tagged when it's a bit more completed.

Until then, watch this space and let me know if there's anything I should consider building into it by [raising an issue](https://github.com/South-Paw/discord-music-bot/issues/new).

Also check out the [v1.0.0 board](https://github.com/South-Paw/discord-music-bot/projects/6) for progress and feature report.

If you get this running, use `!help` to get a list of commands.

## Example usage

### Basic

Install: `npm i discord-musicbot`

Create a file called `run.js` and place the following in it (replace variables where applicable).

```js
const MusicBot = require('discord-musicbot');

const config = {
  // these 3 are always required.
  token: 'YOUR DISCORD TOKEN',
  serverId: 'YOUR SERVER ID',
  textChannelId: 'YOUR COMMANDS TEXT CHANNEL ID',

  // permissions is technically optional, but if you want to access to all
  // permissions you'll need to at the very least make yourself an admin.
  permissions: {
    users: {
      'YOUR USER ID': 'admin',
    },
  }
};

const musicBot = new MusicBot(config);

musicBot.run();
```

Once done, start the bot with with `node run.js`.

### Advanced

```js
const MusicBot = require('discord-musicbot');

const config = {
  // these 3 are always required.
  token: 'YOUR DISCORD TOKEN',
  serverId: 'YOUR SERVER ID',
  textChannelId: 'YOUR COMMANDS TEXT CHANNEL ID',

  // override any default settings.
  // see `src/config/settings.js` for an idea of structure here.
  settings: {
    commandPrefix: '~',
  },

  // customize the replies you receive.
  // see `src/config/replies.js` for an idea of structure here.
  replies: {
    general: {
      unknownCommand: 'Looks like I don\'t know that one!',
    },
  },

  // customize log messages... I dunno why you'd want to do it, but I've
  // allowed for it all the same.
  // see `src/config/logging.js` for an idea of structure here.
  logging: {
    connected: 'Bot started and connected.',
  },

  // set up custom user permission groups and assign users to them.
  permissions: {
    groups: {
      // if you provide an already existing group, it will override that
      // groups default permissions.
      admin: {
        disconnect: true,
        setavatar: true,
        setusername: true,
      },

      // you can define new groups and add permissions to them. All groups
      // will still inherit the global permissions though so if you want to
      // restrict a group down you'll need to turn perms off.
      poweruser: {
        disconnect: true,
      },
    },
    // ... and you can define multiple users to a group.
    // note; there is no 'inheritance' between groups, if a group does not
    // have the permission set then it falls back to the global permissions.
    users: {
      'YOUR USER ID': 'admin',
      'FRIENDS USER ID': 'admin',
      'ANOTHER USER ID': 'poweruser',
      'YET ANOTHER USER ID': 'nogroup', // undefined group, will use global perms.
    },
  }
};

const musicBot = new MusicBot(config);

musicBot.run();
```

## License

This project is licensed under [GNU GPLv3](https://github.com/South-Paw/discord-music-bot/blob/master/LICENSE)

```
Copyright (C) 2017 Alex Gabites

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>.
```
