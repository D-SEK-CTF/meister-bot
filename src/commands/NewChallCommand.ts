import { prefix } from '../const';
import { getCategoryChannels } from '../utils/getCategoryChannels';
import { solvedChannelName } from '../utils/solvedChannelName';
import { ValidMemberMessage } from '../utils/validateMessage';
import BaseCommand from './BaseCommand';
import { CategoryChannel, ChannelType, Client } from 'discord.js';

class NewChallCommand extends BaseCommand {
  private adminRoleId: string;
  commandName = 'new chall';
  usageHelp = `${prefix} ${this.commandName} <CHALL-NAME>`;

  constructor(client: Client, adminRoleId: string) {
    super(client);
    this.adminRoleId = adminRoleId;
  }

  async execute(message: ValidMemberMessage, args: string[]): Promise<void> {
    this.assertHasRole(message, this.adminRoleId);
    this.assertArgsLength(args, 1);
    this.assertNotInGeneralChannel(message);

    const [channelName] = args;

    const category = message.channel.parent as CategoryChannel;
    this.assertValidCategory(category);
    this.assertChannelDoesNotExist(message, channelName, category);

    const newChannel = await message.guild.channels.create({
      name: channelName,
      type: ChannelType.GuildText,
      parent: category.id,
    });

    message.reply(
      `New challenge <#${newChannel.id}> created under ${category.name}.`,
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
    channelName: string,
    category: CategoryChannel,
  ): void {
    const channel = getCategoryChannels(message, category).find((channel) => {
      return [channel.name, solvedChannelName(channel.name)].includes(
        solvedChannelName(channelName),
      );
    });
    if (channel) {
      throw new Error(`Channel ${channelName} already exists.`);
    }
  }
}

export default NewChallCommand;
