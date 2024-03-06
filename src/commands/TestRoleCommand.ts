import { Client } from 'discord.js';
import BaseCommand from './BaseCommand';
import { prefix } from '../const';
import { ValidMemberMessage } from '../utils/validateMessage';

class TestRoleCommand extends BaseCommand {
  private adminRoleId: string;
  commandName = 'testrole';
  usageHelp = `${prefix} ${this.commandName}`;

  constructor(client: Client, adminRoleId: string) {
    super(client);
    this.adminRoleId = adminRoleId;
  }

  execute(message: ValidMemberMessage): Promise<void> {
    const userName = message.member.user.username;
    if (this.hasRoleId(message, this.adminRoleId)) {
      message.reply(`User ${userName} is allowed`);
    } else {
      message.reply(`User ${userName} is NOT allowed`);
    }
    return Promise.resolve();
  }
}

export default TestRoleCommand;
