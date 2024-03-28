import { Client } from 'discord.js';
import { prefix } from '../const';
import { ValidMemberMessage } from '../utils/validateMessage';
import Command from './BaseCommand';

class TestRoleCommand extends Command {
  private adminRoleId: string;
  commandName = 'testrole';
  usageHelp = `${prefix} ${this.commandName}`;
  commandDescription = 'Test if the user is member of the admin role.';
  showInHelp = false;

  constructor(client: Client, requiredRole: null, adminRoleId: string) {
    super(client, requiredRole);
    this.adminRoleId = adminRoleId;
  }

  async execute(message: ValidMemberMessage): Promise<void> {
    const userName = message.member.user.username;
    const role = message.guild.roles.cache.get(this.adminRoleId);
    const roleName = role ? role.name : 'Unknown Role';

    if (this.hasRequiredRole(message, this.adminRoleId)) {
      message.reply(`User \`${userName}\` is member of group \`${roleName}\`.`);
    } else {
      message.reply(
        `User \`${userName}\` is NOT member of group \`${roleName}\`.`,
      );
    }
  }
}

export default TestRoleCommand;
