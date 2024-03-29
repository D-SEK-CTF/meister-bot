import { prefix as meisterPrefix } from '../const';
import { ValidMemberMessage } from '../utils/validateMessage';
import Command from './BaseCommand';
import { CtfChannel } from '../CtfChannel';
import { CtfCategory } from '../CtfCategory';

class ResolvedCommand extends Command {
  commandName = 'resolve';
  usageHelp = `${meisterPrefix} ${this.commandName} <FLAG>`;
  commandDescription =
    'Re-solve a challenge. Useful if you have entered the wrong flag before.';

  async execute(
    message: ValidMemberMessage,
    commandChannel: CtfChannel,
    commandCategory: CtfCategory,
    args: string[],
  ): Promise<void> {
    // Extract the challenge name from the arguments
    this.assertArgsLength(args, 1);
    const [flag] = args;

    // Check if the command was used in the correct channel
    commandChannel.assertSolved();
    commandCategory.assertNotInGeneral();
    commandChannel.assertNotInDiscussion();

    // Update the channel name if stuck
    commandChannel.setSolvedName();

    message.reply(`Challenge was re-solved with flag: \`${flag}\``);
  }
}

export default ResolvedCommand;
