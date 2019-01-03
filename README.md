# Discord Music Bot

🎧 A music bot for Discord servers, self-hosted, easy to use and extendable.


[![npm](https://img.shields.io/npm/v/@south-paw/discord-music-bot.svg)](https://www.npmjs.com/package/@south-paw/discord-music-bot)
[![CI Status](https://img.shields.io/travis/South-Paw/discord-music-bot.svg)](https://travis-ci.org/South-Paw/discord-music-bot)
[![Coveralls Status](https://img.shields.io/coveralls/github/South-Paw/discord-music-bot.svg)](https://coveralls.io/github/South-Paw/discord-music-bot)
[![Dependencies](https://david-dm.org/South-Paw/discord-music-bot.svg)](https://david-dm.org/South-Paw/discord-music-bot)
[![Dev Dependencies](https://david-dm.org/South-Paw/discord-music-bot/dev-status.svg)](https://david-dm.org/South-Paw/discord-music-bot?type=dev)

---

## 🐉 HERE BE DRAGONS

**This bot is still a work-in-progress and will contain bugs!**

If you manage to find any, please report them [here](https://github.com/South-Paw/discord-music-bot/issues) so they can be squashed.

## Features

* Yes.

## 🤖 How do I use this?

**You must first have...**

* A `discord token`, `server id` and `text channel id` for your bot, [read this if you don't have those](https://github.com/South-Paw/discord-music-bot/blob/master/docs/discord-getting-user-ids.md)
* The IDs of the users you wish to give admin permissions on the bot to, [read this if you don't have that](https://github.com/South-Paw/discord-music-bot/blob/master/docs/discord-bot-credentials.md)
* A computer that has working internet
* The ability to follow instructions
* Some common sense

And I thought this note would be covered under common sense but:

```
⚠️ --------------------------------- ⚠️
 |  DO NOT COMMIT OR POST YOUR TOKEN  |
⚠️ --------------------------------- ⚠️

and if you go do that or already have done it... reset it.
```

### Install on Windows

⚠️ Package is not published to npm yet! ⚠️

1. Install [Node.js](https://nodejs.org/en/) (Version 10 or above)
2. Ensure you have [ffmpeg](https://www.ffmpeg.org/) installed and on your system's Path
    * If you do not have ffmpeg installed and on your system's Path, [read this to get it set up](https://github.com/South-Paw/discord-music-bot/blob/master/docs/installing-ffmpeg-on-windows.md)
3. Open a Powershell or Command Prompt window
    * Click Start > Run > type `powershell.exe` OR type `cmd.exe` > Press enter
4. Type `npm i -g @south-paw/discord-music-bot` to install the bot
5. Run the bot from the same window by typing `discord-music-bot -t YOUR_TOKEN -s YOUR_SERVER_ID -c YOUR_CHANNEL_ID -a YOUR_USER_ID`
    * See [CLI commands](#-cli-commands) for more details or type `discord-music-bot --help`
6. When you want to start the bot again (after a restart or shutdown), just run the command in step 5

### Install on Linux

1. todo

### Install on OSX

1. todo

## 📦 Advanced Usage

⚠️ Package is not published to npm yet! ⚠️

1. Create a new folder for the bot script
2. Open a command prompt or terminal window in the folder
3. Install the npm package with `npm i @south-paw/discord-music-bot`
4. Create a file called `run.js` (or whatever you wish to call it)
5. Follow the example below for what you're able to configure and how
6. Start the bot by running `node run.js` from inside the folder

```js
// example of `run.js`

const config = {
  // these 3 are always required.
  token: 'YOUR DISCORD TOKEN',
  serverId: 'YOUR SERVER ID',
  textChannelId: 'YOUR COMMANDS TEXT CHANNEL ID',

  // TODO: other options
};

const musicbot = new MusicBot(config);
musicbot.run();
```

## 👨‍💻 CLI Commands

```
Usage:
  discord-music-bot [arguments]

Required Arguments:
  --token, -t       Your Discord token.
  --server, -s      The id of the server you want to join.
  --channel, -c     The id of the channel you want to listen for commands in.
  --admin, -a       The user id of a Discord account that should have admin permissions. Pass the arg multiple times to add multiple users.

Optional Arguments:
  --debug, -d       Enable debug mode (aka, way more logging).
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
