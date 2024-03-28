import { prefix as meisterPrefix } from '../const';
import { ValidMemberMessage } from '../utils/validateMessage';
import Command from './BaseCommand';
import { CtfChannel } from '../CtfChannel';

class ResolvedCommand extends Command {
  commandName = 'resolve';
  usageHelp = `${meisterPrefix} ${this.commandName} <FLAG>`;
  commandDescription =
    'Re-solve a challenge. Useful if you have entered the wrong flag before.';

  async execute(
    message: ValidMemberMessage,
    channel: CtfChannel,
    args: string[],
  ): Promise<void> {
    // Extract the challenge name from the arguments
    this.assertArgsLength(args, 1);
    const [flag] = args;

    // Check if the command was used in the correct channel
    channel.assertSolved();
    channel.assertNotInGeneral();
    channel.assertNotInDiscussion();

    message.reply(`Challenge was re-solved with flag: \`${flag}\``);
  }
}

export default ResolvedCommand;
