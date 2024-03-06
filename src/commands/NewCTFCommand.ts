import { ChannelType, Client, Message } from 'discord.js';
import BaseCommand from './BaseCommand';
import { prefix } from '../const';
import { findChannelByName } from '../utils/findChannelByName';

class NewCTFCommand extends BaseCommand {
  private adminRoleId: string;
  commandName = 'new ctf';
  usageHelp = `${prefix} ${this.commandName} <CTF-NAME>`;

  constructor(client: Client, adminRoleId: string) {
    super(client);
    this.adminRoleId = adminRoleId;
  }

  async execute(message: Message<true>, args: string[]): Promise<void> {
    this.assertHasRole(message, this.adminRoleId);
    this.assertArgsLength(args, 1);

    const [categoryName] = args;

    this.assertChannelNotAlreadyExists(message, categoryName);

    const category = await message.guild.channels.create({
      name: categoryName,
      type: ChannelType.GuildCategory,
    });
    const textChannel = await message.guild.channels.create({
      name: categoryName,
      type: ChannelType.GuildText,
      parent: category.id,
    });
    await message.guild.channels.create({
      name: categoryName,
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
    message: Message<true>,
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
}

export default NewCTFCommand;
