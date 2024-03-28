import { CategoryChannel, ChannelType } from 'discord.js';
import { prefix } from '../const';
import { ValidMemberMessage } from '../utils/validateMessage';
import Command from './BaseCommand';
import { findCtfChannelByName } from '../utils/findCtfChannelByName';
import { CtfChannel } from '../CtfChannel';
import { findCtfByName } from '../utils/findCtfByName';

class NewChallCommand extends Command {
  commandName = 'new chall';
  usageHelp = `${prefix} ${this.commandName} <CHALL-NAME> [CTF-NAME]`;
  commandDescription = 'Create a new challenge in a CTF.';

  async execute(
    message: ValidMemberMessage,
    channel: CtfChannel,
    args: string[],
  ): Promise<void> {
    this.assertArgsLengthRange(args, 1, 2);
    channel.assertNotInDiscussion();

    const [channelName, ctfName] = args;

    const category = ctfName
      ? findCtfByName(channel.categoryObject.guild, ctfName, true)
      : message.channel.parent;
    this.assertValidCategory(category);
    this.assertChannelDoesNotExist(message, channelName, category);

    const newChannel = await CtfChannel.createChall(channelName, category);

    message.reply(
      `New challenge ${newChannel.ref} created under \`${category.name}\`.`,
    );
  }

  /**
   * @param category The category channel
   * @throws Error if the category is invalid
   */
  assertValidCategory(category: CategoryChannel): void {
    if (!category || category.type !== ChannelType.GuildCategory) {
      throw new Error('Please use this command inside a category.');
    }
  }

  /**
   * @param message The message object
   * @param category The category channel
   * @throws Error if the channel already exists
   */
  assertChannelDoesNotExist(
    message: ValidMemberMessage,
    targetChannelName: string,
    category: CategoryChannel,
  ): void {
    const channel = findCtfChannelByName(
      category,
      targetChannelName,
      ChannelType.GuildText,
      true,
    );

    if (channel) {
      throw new Error(`Challenge <#${channel.id}> already exists.`);
    }
  }
}

export default NewChallCommand;
