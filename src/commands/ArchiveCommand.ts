import { CategoryChannel, ChannelType, Client, Collection } from 'discord.js';
import { archivedSuffix, prefix } from '../const';
import { ValidMemberMessage } from '../utils/validateMessage';
import BaseCommand from './BaseCommand';
import { findChannelByName } from '../utils/findChannelByName';

class ArchiveCommand extends BaseCommand {
  private adminRoleId: string;
  commandName = 'archive ctf';
  usageHelp = `${prefix} ${this.commandName} [CTF-NAME]`;

  constructor(client: Client, adminRoleId: string) {
    super(client);
    this.adminRoleId = adminRoleId;
  }

  async execute(message: ValidMemberMessage, args: string[]): Promise<void> {
    this.assertHasRole(message, this.adminRoleId);
    this.assertArgsLengthRange(args, 0, 1);

    const [ctfName] = args;

    const category = ctfName
      ? findChannelByName(message, ctfName, ChannelType.GuildCategory, true)
      : message.channel.parent;

    this.assertNotGeneralCategory(category);
    this.assertNotAlreadyArchived(category);

    // Rename the category to indicate it's archived
    category.setName(`${category.name}${archivedSuffix}`);

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
      category.name.endsWith(archivedSuffix),
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
    if (category.name.endsWith(archivedSuffix)) {
      throw new Error('CTF is already archived.');
    }
  }
}

export default ArchiveCommand;
