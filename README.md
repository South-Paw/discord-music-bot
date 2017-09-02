# discord-music-bot
A self-hosted Node.js music bot for Discord servers.

**This is still very much a work-in-progress.**

* Documentation will be added when there's something a bit more tangible to use.
* A release will be tagged when it's a bit more fleshed out.

Until then, watch this space and let me know if there's anything I should consider building into it.

If you do get this running, use `!help` to get a list of commands.

# Example usage

## Basic

```js
const MusicBot = require('./src/index.js');

const config = {
  token: 'YOUR DISCORD TOKEN',
  serverId: 'YOUR SERVER ID',
  textChannelId: 'YOUR COMMANDS TEXT CHANNEL ID',
};

const musicBot = new MusicBot(config);

musicBot.run();
```

## Advanced

```js
const MusicBot = require('./src/index.js');

const config = {
  token: 'YOUR DISCORD TOKEN',
  serverId: 'YOUR SERVER ID',
  textChannelId: 'YOUR COMMANDS TEXT CHANNEL ID',
  settings: {
    commandPrefix: '~', // custom command prefix
  },
  messages: {
    // custom bot message (see src/config/messages for keys).
    reply: {
      unknownCommand: 'BEEP... unknown command!',
    },
  },
};

const musicBot = new MusicBot(config);

musicBot.run();
```

# License

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

