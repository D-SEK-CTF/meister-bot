import { prefix } from '../const';
import { ValidMemberMessage } from '../utils/validateMessage';
import Command from './BaseCommand';
import { CtfChannel } from '../CtfChannel';
import { CtfCategory } from '../CtfCategory';

class NewChallCommand extends Command {
  commandName = 'new chall';
  usageHelp = `${prefix} ${this.commandName} <CHALL-NAME> [CTF-NAME]`;
  commandDescription = 'Create a new challenge under a CTF.';

  async execute(
    message: ValidMemberMessage,
    commandChannel: CtfChannel,
    commandCategory: CtfCategory,
    args: string[],
  ): Promise<void> {
    this.assertArgsLengthRange(args, 1, 2);
    commandChannel.assertNotInDiscussion();

    const [channelName, ctfName] = args;

    const category = ctfName
      ? CtfCategory.fromName(ctfName, commandCategory.object.guild, true)
      : CtfCategory.fromMessage(message);

    this.assertChannelDoesNotExist(channelName, category);

    const newChannel = await CtfChannel.createChall(channelName, category);

    message.reply(
      `New challenge ${newChannel.ref} created under \`${category.name}\`.`,
    );
  }

  /**
   * @param message The message object
   * @param category The category channel
   * @throws Error if the channel already exists
   */
  assertChannelDoesNotExist(channelName: string, category: CtfCategory): void {
    const channel = CtfChannel.fromName(channelName, category);
    if (channel) {
      throw new Error(`Challenge ${channel.ref} already exists.`);
    }
  }
}

export default NewChallCommand;
