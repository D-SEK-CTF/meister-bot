import { prefix as meisterPrefix } from '../const';
import { ValidMemberMessage } from '../utils/validateMessage';
import Command from './BaseCommand';
import { CtfChannel } from '../CtfChannel';

class SolvedCommand extends Command {
  commandName = 'solved';
  usageHelp = `${meisterPrefix} ${this.commandName} <FLAG>`;
  commandDescription = 'Solve a challenge given the flag.';

  async execute(
    message: ValidMemberMessage,
    channel: CtfChannel,
    args: string[],
  ): Promise<void> {
    // Extract the challenge name from the arguments
    this.assertArgsLength(args, 1);
    const [flag] = args;

    // Check if the command was used in the correct channel
    channel.assertNotSolved();
    channel.assertNotInGeneral();
    channel.assertNotInDiscussion();

    // Rename the channel and reply to the user
    channel.setSolvedName();

    // Notify the participants that the challenge was solved
    const formattedChallengeParticipants = channel
      .participatingMembers()
      .map((member) => `<@${member.id}>`)
      .join(', ');

    channel.moveToBottom();

    message.reply(
      `Challenge was solved with flag: \`${flag}\`\n:confetti_ball: Good job ${formattedChallengeParticipants}! :confetti_ball:`,
    );
  }
}

export default SolvedCommand;
