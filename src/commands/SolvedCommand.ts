import { GuildBasedChannel, Message } from 'discord.js';
import BaseCommand from './BaseCommand';
import { prefix } from '../const';
import { findChannelByName } from '../utils/findChannelByName';
class SolvedCommand extends BaseCommand {
  commandName = 'solved';
  usageHelp = `${prefix} ${this.commandName} <FLAG> [<CHALL-NAME>]`;
  private solvedSuffix = '-✅';

  assertChallengeNotSolved(challName: string): void {
    if (challName.endsWith(this.solvedSuffix)) {
      throw new Error('Challenge is already solved');
    }
  }

  assertTargetChannelExists(message: Message<true>, challName: string): void {
    const channel = findChannelByName(message, challName);
    if (!channel) {
      throw new Error(`Channel ${challName} does not exist`);
    }
  }

  assertTargetChannelIsNotInGeneral(
    channel: GuildBasedChannel,
    challName: string,
  ): void {
    if (channel.parent?.name === 'general') {
      throw new Error(
        `Channel ${challName} is in the general category and cannot be solved`,
      );
    }
  }

  solvedChannelName(challName: string): string {
    return `${challName}${this.solvedSuffix}`;
  }

  async execute(message: Message<true>, args: string[]): Promise<void> {
    // Extract the challenge name from the arguments
    this.assertArgsLengthRange(args, 1, 2);
    const [flag, challName] = args;
    const channelName = challName || message.channel.name;

    // Check if the command was used in the correct channel
    this.assertInTextChannel(message);
    this.assertChallengeNotSolved(channelName);

    const newChannelName = this.solvedChannelName(channelName);
    this.assertTargetChannelExists(message, channelName);

    // Find the channel and check if it's in the general category
    const channel = findChannelByName(message, channelName)!;
    this.assertTargetChannelIsNotInGeneral(channel, channelName);

    // Rename the channel and reply to the user
    await channel.setName(newChannelName);
    message.reply(`Solved challenge <#${channelName}> with flag \`${flag}\`!`);
  }
}

export default SolvedCommand;
