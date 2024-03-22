import { ChannelType, Client } from 'discord.js';
import { archivedSuffix, discussionChannelName, prefix } from '../const';
import { findChannelByName } from '../utils/findChannelByName';
import { ValidMemberMessage } from '../utils/validateMessage';
import BaseCommand from './BaseCommand';

class NewCTFCommand extends BaseCommand {
  private adminRoleId: string;
  commandName = 'new ctf';
  usageHelp = `${prefix} ${this.commandName} <CTF-NAME> [CTF-URL] [USERNAME] [PASSWORD]`;

  constructor(client: Client, adminRoleId: string) {
    super(client);
    this.adminRoleId = adminRoleId;
  }

  async execute(message: ValidMemberMessage, args: string[]): Promise<void> {
    this.assertHasRole(message, this.adminRoleId);
    this.assertArgsLengthRange(args, 1, 4);

    const [categoryName, ctfUrl, ctfUsername, ctfPassword] = args;

    if (ctfUrl) this.assertValidUrl(ctfUrl);
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

    // Move the category to the top
    await category.setPosition(1);

    // Write the URL, username, and password to the channel topic
    const topic = this.createTopicString({
      URL: ctfUrl,
      Username: ctfUsername,
      Password: ctfPassword,
    });
    await textChannel.setTopic(topic);

    message.reply(`New CTF \`${category.name}\` created: <#${textChannel.id}>`);
  }

  createTopicString(topic: Record<string, string>): string {
    // Remove any empty values
    Object.entries(topic).forEach(([key, value]) => {
      if (!value) delete topic[key];
    });

    // Convert the object to a string
    return Object.entries(topic)
      .map(([key, value]) => `**${key}**: ${value}`)
      .join('\n');
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
    const channel =
      findChannelByName(message, categoryName, ChannelType.GuildCategory) ||
      findChannelByName(
        message,
        `${categoryName}${archivedSuffix}`,
        ChannelType.GuildCategory,
      );
    if (channel) {
      throw new Error(
        `CTF \`${channel.name}\` already exists: ${channel.children.cache.at(
          0,
        )}`,
      );
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

  /**
   *
   * @param url The URL to validate
   * @throws Error if the URL is invalid
   * @example
   * ```ts
   * this.assertValidUrl(url);
   * ```
   */
  assertValidUrl(url: string): void {
    if (!url.startsWith('http')) {
      throw new Error('Invalid URL.');
    }
  }
}

export default NewCTFCommand;
