import { prefix as meisterPrefix } from '../const';
import { ValidMemberMessage } from '../utils/validateMessage';
import Command from './BaseCommand';
import { CtfChannel } from '../CtfChannel';
import { CtfCategory } from '../CtfCategory';

class SolvedCommand extends Command {
  commandName = 'solved';
  usageHelp = `${meisterPrefix} ${this.commandName} <FLAG>`;
  commandDescription = 'Solve a challenge given the flag.';

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
    commandChannel.assertNotSolved();
    commandChannel.assertNotInDiscussion();
    commandCategory.assertNotInGeneral();

    // Rename the channel and reply to the user
    commandChannel.setSolvedName();

    // Notify the participants that the challenge was solved
    const formattedChallengeParticipants = commandChannel
      .participatingMembers()
      .map((member) => `<@${member.id}>`)
      .join(', ');

    commandChannel.moveToBottom();

    message.reply(
      `Challenge was solved with flag: \`${flag}\`\n:confetti_ball: Good job ${formattedChallengeParticipants}! :confetti_ball:`,
    );
  }
}

export default SolvedCommand;
