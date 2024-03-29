import { prefix as meisterPrefix } from '../const';
import { ValidMemberMessage } from '../utils/validateMessage';
import Command from './BaseCommand';
import { CtfChannel } from '../CtfChannel';
import { CtfCategory } from '../CtfCategory';

class UnsolveCommand extends Command {
  commandName = 'unsolve';
  usageHelp = `${meisterPrefix} ${this.commandName}`;
  commandDescription = 'Mark a solved challenge as unsolved again.';
  showInHelp = false;

  async execute(
    message: ValidMemberMessage,
    commandChannel: CtfChannel,
    commandCategory: CtfCategory,
    args: string[],
  ): Promise<void> {
    // Extract the challenge name from the arguments
    this.assertArgsLength(args, 0);

    // Check if the command was used in the correct channel
    commandChannel.assertSolved();
    commandChannel.assertNotInGeneral();
    commandChannel.assertNotInDiscussion();

    // Rename the channel and reply to the user
    commandChannel.setDiscussionName();

    commandChannel.moveToTop();

    message.reply(`Challenge marked as unsolved`);
  }
}

export default UnsolveCommand;
