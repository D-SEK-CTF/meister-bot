import { ChannelType, GuildBasedChannel, Message } from 'discord.js';
import BaseCommand from './BaseCommand';
import { prefix } from '../const';
import { findChannelByName } from '../utils/findChannelByName';
class SolvedCommand extends BaseCommand {
  commandName = 'solved';
  usageHelp = `${prefix} ${this.commandName} <FLAG> [<CHALL-NAME>]`;
  private solvedSuffix = '-✅';

  async execute(message: Message<true>, args: string[]): Promise<void> {
    // Extract the challenge name from the arguments
    this.assertArgsLengthRange(args, 1, 2);
    const [flag, challName] = args;
    const channelName = challName ?? message.channel.parent?.name!;

    // Check if the command was used in the correct channel
    this.assertChallengeNotSolved(channelName);
    this.assertTargetCategoryExists(message, channelName);

    // Find the category and check if it's in the general category
    const channel = challName
      ? findChannelByName(message, channelName, ChannelType.GuildCategory)!
      : message.channel.parent!;
    this.assertTargetChannelIsNotGeneral(channel);

    // Rename the channel and reply to the user
    const newChannelName = this.solvedChannelName(channelName);
    await channel.setName(newChannelName);
    message.reply(`Solved challenge ${channelName} with flag \`${flag}\`!`);
  }

  /**
   *
   * @param challName The name of the challenge
   * @throws Error if the challenge is already solved
   */
  assertChallengeNotSolved(challName: string): void {
    if (challName.endsWith(this.solvedSuffix)) {
      throw new Error('Challenge is already solved');
    }
  }

  /**
   *
   * @param message The message object
   * @param challName The name of the challenge
   * @throws Error if the category does not exist
   */
  assertTargetCategoryExists(message: Message<true>, challName: string): void {
    const channel = findChannelByName(
      message,
      challName,
      ChannelType.GuildCategory,
    );
    if (!channel) {
      throw new Error(`Channel ${challName} does not exist`);
    }
  }

  /**
   *
   * @param channel The channel to check
   * @throws Error if the channel is a general category
   */
  assertTargetChannelIsNotGeneral(channel: GuildBasedChannel): void {
    if (channel.name === 'general') {
      throw new Error(`General category cannot be solved`);
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
