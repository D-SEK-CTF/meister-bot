import { CategoryChannel, ChannelType, Client } from 'discord.js';
import { prefix } from '../const';
import { ValidMemberMessage } from '../utils/validateMessage';
import BaseCommand from './BaseCommand';
import { findCtfChannelByName } from '../utils/findCtfChannelByName';
import { CtfChannel } from '../CtfChannel';

class NewChallCommand extends BaseCommand {
  private adminRoleId: string;
  commandName = 'new chall';
  usageHelp = `${prefix} ${this.commandName} <CHALL-NAME> [CTF-NAME]`;

  constructor(client: Client, adminRoleId: string) {
    super(client);
    this.adminRoleId = adminRoleId;
  }

  async execute(
    message: ValidMemberMessage,
    channel: CtfChannel,
    args: string[],
  ): Promise<void> {
    this.assertArgsLengthRange(args, 1, 2);
    this.assertNotInGeneralChannel(message);

    const [channelName, ctfName] = args;

    const category = ctfName
      ? findCtfChannelByName(
          channel.categoryObject,
          ctfName,
          ChannelType.GuildCategory,
          true,
        )
      : message.channel.parent;
    this.assertValidCategory(category);
    this.assertChannelDoesNotExist(message, channelName, category);

    const newChannel = await message.guild.channels.create({
      name: channelName,
      type: ChannelType.GuildText,
      parent: category.id,
    });

    message.reply(
      `New challenge <#${newChannel.id}> created under \`${category.name}\`.`,
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
