import { Client } from 'discord.js';
import { prefix } from '../const';
import { ValidMemberMessage } from '../utils/validateMessage';
import BaseCommand from './BaseCommand';

class TestRoleCommand extends BaseCommand {
  private adminRoleId: string;
  commandName = 'testrole';
  usageHelp = `${prefix} ${this.commandName}`;

  constructor(client: Client, adminRoleId: string) {
    super(client);
    this.adminRoleId = adminRoleId;
  }

  async execute(message: ValidMemberMessage): Promise<void> {
    const userName = message.member.user.username;
    if (this.hasRoleId(message, this.adminRoleId)) {
      message.reply(`User ${userName} is allowed`);
    } else {
      message.reply(`User ${userName} is NOT allowed`);
    }
  }
}

export default TestRoleCommand;
