import { prefix } from '../const';
import { ValidMemberMessage } from '../utils/validateMessage';
import Command from './BaseCommand';

class PingCommand extends Command {
  commandName = 'ping';
  usageHelp = `${prefix} ${this.commandName}`;
  commandDescription = 'Test if the bot is responsive.';
  showInHelp = false;

  async execute(message: ValidMemberMessage): Promise<void> {
    const responseTime = Date.now() - message.createdTimestamp;
    message.reply(`Response time: \`${responseTime}ms\``);
  }
}

export default PingCommand;
