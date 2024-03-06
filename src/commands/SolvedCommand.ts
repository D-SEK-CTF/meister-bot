import { ChannelType, GuildBasedChannel, Message } from 'discord.js';
import BaseCommand from './BaseCommand';
import { prefix } from '../const';
import { findChannelByName } from '../utils/findChannelByName';
class SolvedCommand extends BaseCommand {
  commandName = 'solved';
  usageHelp = `${prefix} ${this.commandName} <FLAG>`;
  private solvedSuffix = '-✅';

  async execute(message: Message<true>, args: string[]): Promise<void> {
    // Extract the challenge name from the arguments
    this.assertArgsLength(args, 1);
    const [flag] = args;
    const channelName = message.channel.name;

    // Check if the command was used in the correct channel
    this.assertChallengeNotSolved(channelName);
    this.assertTargetChannelExists(message, channelName);
    this.assertNotInDicussionChannel(message);

    // Find the category and check if it's in the general category
    const channel = message.channel;
    this.assertTargetChannelIsNotInGeneral(channel);

    // Rename the channel and reply to the user
    const newChannelName = this.solvedChannelName(channelName);
    await channel.setName(newChannelName);
    message.reply(`Solved challenge with flag \`${flag}\`!`);
  }

  /**
   *
   * @param message The message object
   * @throws Error if the channel is a discussion channel
   */
  assertNotInDicussionChannel(message: Message<true>): void {
    if (message.channel.name === message.channel.parent?.name) {
      throw new Error('Discussion channel cannot be solved.');
    }
  }

  /**
   *
   * @param challName The name of the challenge
   * @throws Error if the challenge is already solved
   */
  assertChallengeNotSolved(challName: string): void {
    if (challName.endsWith(this.solvedSuffix)) {
      throw new Error('Challenge is already solved.');
    }
  }

  /**
   *
   * @param message The message object
   * @param challName The name of the challenge
   * @throws Error if the category does not exist
   */
  assertTargetChannelExists(message: Message<true>, challName: string): void {
    const channel = findChannelByName(
      message,
      challName,
      ChannelType.GuildText,
    );
    if (!channel) {
      throw new Error(`Channel ${challName} does not exist.`);
    }
  }

  /**
   *
   * @param channel The channel to check
   * @throws Error if the channel is a general category
   */
  assertTargetChannelIsNotInGeneral(channel: GuildBasedChannel): void {
    if (channel.parent?.name === 'general') {
      throw new Error(`General category cannot be solved.`);
    }
  }

  /**
   *
   * @param challName The name of the challenge
   * @returns The name of the solved challenge
   */
  solvedChannelName(challName: string): string {
    return `${challName}${this.solvedSuffix}`;
  }
}

export default SolvedCommand;
