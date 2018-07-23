# Discord Music Bot

🎧 A music bot for Discord servers, self-hosted, easy to use and extendable.


[![npm](https://img.shields.io/npm/v/discord-musicbot.svg)](https://www.npmjs.com/package/discord-musicbot)
[![CI Status](https://img.shields.io/travis/South-Paw/discord-musicbot/refactor.svg)](https://travis-ci.org/South-Paw/discord-musicbot)
[![Coveralls Status](https://img.shields.io/coveralls/github/South-Paw/discord-musicbot/refactor.svg)](https://coveralls.io/github/South-Paw/discord-musicbot?branch=refactor)
[![Dependencies](https://david-dm.org/South-Paw/discord-musicbot/refactor.svg)](https://david-dm.org/South-Paw/discord-musicbot/refactor)
[![Dev Dependencies](https://david-dm.org/South-Paw/discord-musicbot/refactor/dev-status.svg)](https://david-dm.org/South-Paw/discord-musicbot/refactor?type=dev)

---

## 🐉 HERE BE DRAGONS

**This bot is still a work-in-progress and will contain bugs!**

If you manage to find any, please report them [here](https://github.com/South-Paw/discord-musicbot/issues) so they can be squashed.

## Features

* Yes.

## 🤖 How do I use this?

**You must first have...**

* A `discord token`, `server id` and `text channel id` for your bot. (TODO: [read this if you don't have those](#TODO))
* A computer that has working internet
* The ability to follow instructions.
* Some common sense.

And I thought this note would be covered under common sense but:

```
⚠️ -------------------------------- ⚠️
 | DO NOT COMMIT OR POST YOUR TOKEN  |
⚠️ -------------------------------- ⚠️

and if you do or already have... reset it.
```

### Install on Windows

1. Install [Node.js](https://nodejs.org/en/) (Version 8 or above)
2. Open a Powershell or Command Prompt window
    * **Tip:** Start > Run > type `powershell.exe` OR type `cmd.exe` > Enter
3. Type `npm i -g discord-musicbot` to install the bot.
4. Run the bot from the same window by typing `discord-musicbot -t YOUR_TOKEN -s YOUR_SERVER_ID -c YOUR_CHANNEL_ID`
5. When you want to start the bot again (after a restart or shutdown), just run the command in step 4.

### Install on Linux

1. todo

### Install on OSX

1. todo

## 📦 Advanced Usage

1. Create a new folder for the bot script
2. Open a command prompt or terminal window in the folder
3. Install the npm package with `npm i discord-musicbot`
4. Create a file called `run.js` (or whatever you wish to call it)
5. Follow the example below for what you're able to configure and how
6. Start the bot using `node run.js` from inside the folder

```js
// example of `run.js`

const config = {
  // these 3 are always required.
  token: 'YOUR DISCORD TOKEN',
  serverId: 'YOUR SERVER ID',
  textChannelId: 'YOUR COMMANDS TEXT CHANNEL ID',

  // TODO: other options
};

// this `while (true)` will ensure the bot restarts upon an Exception occurring
while (true) {
  const musicBot = new MusicBot(config);

  try {
    musicbot.run();
  } catch (e) {
    console.log(e);
  }
}
```

## License

This project is licensed under [GNU GPLv3](https://github.com/South-Paw/discord-musicbot/blob/master/LICENSE)

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
