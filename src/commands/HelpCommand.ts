import { Client } from 'discord.js';
import { prefix } from '../const';
import { ValidMemberMessage } from '../utils/validateMessage';
import BaseCommand from './BaseCommand';
import { CtfChannel } from '../CtfChannel';

class HelpCommand extends BaseCommand {
  private adminRoleId: string;
  commandName = 'help';
  usageHelp = `${prefix} ${this.commandName} ["all" | command-name]`;
  commands: BaseCommand[];
  helpCommands: string[];

  constructor(client: Client, adminRoleId: string, commands: BaseCommand[]) {
    super(client);
    this.adminRoleId = adminRoleId;
    this.commands = commands;
    this.helpCommands = commands.map((command) => command.usageHelp);
  }

  async execute(
    message: ValidMemberMessage,
    channel: CtfChannel,
    args: string[],
  ): Promise<void> {
    this.assertArgsLengthRange(args, 0, 1);

    const [commandName] = args;

    message.reply(
      `## Available commands\n\`${this.helpCommands.join(
        '`, \n`',
      )}\`. \n\nSource code: [github.com/flagermeisters/meister-bot](<https://github.com/flagermeisters/meister-bot>)`,
    );
  }
}

export default HelpCommand;
