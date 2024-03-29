import { Guild } from 'discord.js';
import { prefix } from '../const';
import { ValidMemberMessage } from '../utils/validateMessage';
import Command from './BaseCommand';
import { CtfChannel } from '../CtfChannel';
import { CtfCategory } from '../CtfCategory';

class NewCTFCommand extends Command {
  commandName = 'new ctf';
  usageHelp = `${prefix} ${this.commandName} <CTF-NAME> [CTF-URL] [USERNAME] [PASSWORD]`;
  commandDescription = 'Create a new CTF.';

  async execute(
    message: ValidMemberMessage,
    commandChannel: CtfChannel,
    commandCategory: CtfCategory,
    args: string[],
  ): Promise<void> {
    this.assertArgsLengthRange(args, 1, 4);

    const [categoryName, ctfUrl, ctfUsername, ctfPassword] = args;

    if (ctfUrl) this.assertValidUrl(ctfUrl);
    this.assertChannelNameIsValid(categoryName);
    this.assertChannelNotAlreadyExists(
      commandCategory.object.guild,
      categoryName,
    );

    const category = await CtfCategory.createCTF(categoryName, message.guild);
    const channel = await CtfChannel.createDiscussion(category);

    // Move the category to the top
    category.moveToTop();

    // Write the URL, username, and password to the channel topic
    const topic = this.createTopicString({
      URL: ctfUrl,
      Username: ctfUsername,
      Password: ctfPassword,
    });
    channel.setTopic(topic);

    message.reply(`New CTF \`${category.name}\` created: ${channel.ref}`);
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
   * @param ctfName The name of the category
   * @throws Error if the category already exists
   */
  assertChannelNotAlreadyExists(guild: Guild, ctfName: string): void {
    const ctfCategory = CtfCategory.fromName(ctfName, guild);

    if (ctfCategory) {
      throw new Error(
        `CTF \`${ctfCategory.name}\` already exists: ${ctfCategory.children.at(
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
