class Command {
  constructor(bot, args, message) {
    this.bot = bot;
    this.args = args;
    this.message = message;
  }
}

module.exports = Command;
