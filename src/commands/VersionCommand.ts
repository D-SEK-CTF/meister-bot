import { prefix } from '../const';
import { ValidMemberMessage } from '../utils/validateMessage';
import Command from './BaseCommand';

class VersionCommand extends Command {
  commandName = 'version';
  usageHelp = `${prefix} ${this.commandName}`;
  commandDescription = 'Display the current version of the bot.';
  showInHelp = false;

  async execute(message: ValidMemberMessage): Promise<void> {
    // Get the version from the package.json file
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { version } = require('../../package.json');
    message.reply(`Current version: \`${version}\``);
  }
}

export default VersionCommand;
