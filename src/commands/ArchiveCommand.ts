import { Client } from 'discord.js';
import { prefix } from '../const';
import { ValidMemberMessage } from '../utils/validateMessage';
import BaseCommand from './BaseCommand';

class ArchiveCommand extends BaseCommand {
  private adminRoleId: string;
  commandName = 'archive ctf';
  usageHelp = `${prefix} ${this.commandName}`;

  constructor(client: Client, adminRoleId: string) {
    super(client);
    this.adminRoleId = adminRoleId;
  }

  async execute(message: ValidMemberMessage): Promise<void> {
    this.assertHasRole(message, this.adminRoleId);
    this.assertNotInGeneralChannel(message);
    this.assertNotAlreadyArchived(message);

    const category = message.channel.parent;

    // Rename the category to indicate it's archived
    category.setName(`${category.name} (archived)`);

    // Set the permissions to read only
    category.children.cache.forEach((channel) => {
      channel.permissionOverwrites.edit(message.guild.roles.everyone, {
        SendMessages: false,
      });
    });

    message.reply('CTF has been archived.');
  }

  /**
   *
   * @param message ValidMemberMessage
   * @throws Error if the CTF is already archived
   */
  assertNotAlreadyArchived(message: ValidMemberMessage) {
    if (message.channel.parent.name.endsWith('(archived)')) {
      throw new Error('CTF is already archived.');
    }
  }
}

export default ArchiveCommand;
