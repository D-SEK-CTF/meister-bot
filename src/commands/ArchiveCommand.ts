import { CategoryChannel, ChannelType, Collection } from 'discord.js';
import { archivedCategorySuffix, prefix } from '../const';
import { ValidMemberMessage } from '../utils/validateMessage';
import Command from './BaseCommand';
import { CtfChannel } from '../CtfChannel';
import { findCtfByName } from '../utils/findCtfByName';

class ArchiveCommand extends Command {
  commandName = 'archive ctf';
  usageHelp = `${prefix} ${this.commandName} [CTF-NAME]`;
  commandDescription = 'Archives a CTF, making it read-only.';

  async execute(
    message: ValidMemberMessage,
    channel: CtfChannel,
    args: string[],
  ): Promise<void> {
    this.assertArgsLengthRange(args, 0, 1);

    const [ctfName] = args;

    const category = ctfName
      ? findCtfByName(channel.channelObject.guild, ctfName)
      : channel.categoryObject;

    this.assertNotGeneralCategory(category);
    this.assertNotAlreadyArchived(category);

    // Rename the category to indicate it's archived
    category.setName(`${category.name}${archivedCategorySuffix}`);

    // Set the permissions to read only
    category.children.cache.forEach((channel) => {
      channel.permissionOverwrites.edit(message.guild.roles.everyone, {
        SendMessages: false,
      });
    });

    // Move the category down
    category.setPosition(this.findArchivedCategoryPosition(message));

    message.reply(`CTF \`${category.name}\` has been archived.`);
  }

  /**
   * Find the lowest position index of all archived categories,
   * or the highest position index + 1 if there are none.
   *
   * @param message ValidMemberMessage
   * @returns The position of the archived category
   */
  findArchivedCategoryPosition(message: ValidMemberMessage): number {
    // Get all categories
    const categories = message.guild.channels.cache.filter(
      (channel) => channel.type === ChannelType.GuildCategory,
    ) as Collection<string, CategoryChannel>;

    // Filter out only the archived categories
    const archivedCategories = categories.filter((category) =>
      category.name.endsWith(archivedCategorySuffix),
    );

    // If there are no archived categories, return the highest position index + 1
    // This places the archived category at the very bottom of the list
    if (archivedCategories.size === 0) return categories.size;

    // Find the category with the lowest position
    const archivedCategoryPositions = archivedCategories.map(
      (category) => category.position,
    );
    return Math.min(...archivedCategoryPositions) - 1;
  }

  /**
   *
   * @param message ValidMemberMessage
   * @throws Error if the CTF is already archived
   */
  assertNotAlreadyArchived(category: CategoryChannel) {
    if (category.name.endsWith(archivedCategorySuffix)) {
      throw new Error('CTF is already archived.');
    }
  }
}

export default ArchiveCommand;
