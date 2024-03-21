import { ChannelType, Client } from 'discord.js';
import { discussionChannelName, prefix } from '../const';
import { findChannelByName } from '../utils/findChannelByName';
import { ValidMemberMessage } from '../utils/validateMessage';
import BaseCommand from './BaseCommand';

class NewCTFCommand extends BaseCommand {
  private adminRoleId: string;
  commandName = 'new ctf';
  usageHelp = `${prefix} ${this.commandName} <CTF-NAME>`;

  constructor(client: Client, adminRoleId: string) {
    super(client);
    this.adminRoleId = adminRoleId;
  }

  async execute(message: ValidMemberMessage, args: string[]): Promise<void> {
    this.assertHasRole(message, this.adminRoleId);
    this.assertArgsLength(args, 1);

    const [categoryName] = args;

    this.assertChannelNameIsValid(categoryName);
    this.assertChannelNotAlreadyExists(message, categoryName);

    const category = await message.guild.channels.create({
      name: categoryName,
      type: ChannelType.GuildCategory,
    });
    const textChannel = await message.guild.channels.create({
      name: discussionChannelName,
      type: ChannelType.GuildText,
      parent: category.id,
    });
    await message.guild.channels.create({
      name: discussionChannelName,
      type: ChannelType.GuildVoice,
      parent: category.id,
    });

    message.reply(`New CTF <#${textChannel.id}> created.`);
  }

  /**
   *
   * @param message The message object
   * @param categoryName The name of the category
   * @throws Error if the category already exists
   */
  assertChannelNotAlreadyExists(
    message: ValidMemberMessage,
    categoryName: string,
  ): void {
    const channel = findChannelByName(
      message,
      categoryName,
      ChannelType.GuildCategory,
    );
    if (channel) {
      throw new Error(`CTF ${channel.name} already exists.`);
    }
  }

  /**
   *
   * @param categoryName The name of the category
   * @throws Error if the category name is invalid
   */
  assertChannelNameIsValid(categoryName: string): void {
    if (categoryName === '') {
      throw new Error('Invalid category name.');
    }
  }
}

export default NewCTFCommand;
