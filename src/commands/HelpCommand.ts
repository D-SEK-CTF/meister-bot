import { Client } from 'discord.js';
import { prefix } from '../const';
import { ValidMemberMessage } from '../utils/validateMessage';
import Command from './BaseCommand';
import { CtfChannel } from '../CtfChannel';

class HelpCommand extends Command {
  commandName = 'help';
  usageHelp = `${prefix} ${this.commandName} ["all" | command-name]`;
  commandDescription = 'Show help for a specific command.';
  commands: Command[];
  helpCommands: string[];
  commandNames: string[];

  constructor(
    client: Client,
    requiredRole: string | null,
    commands: Command[],
  ) {
    super(client, requiredRole);
    this.commands = commands;
    this.helpCommands = commands.map((command) => command.usageHelp);
    this.commandNames = commands.map((command) => command.commandName);
  }

  async execute(
    message: ValidMemberMessage,
    channel: CtfChannel,
    args: string[],
  ): Promise<void> {
    this.assertArgsLengthRange(args, 0, 1);

    const [commandName] = args;

    if (!commandName || commandName === 'all') {
      const showAllCommands = commandName === 'all';
      const formattedCommands = this.commands
        .filter(
          (command) =>
            command.hasRequiredRole(message) &&
            (showAllCommands || command.showInHelp === true),
        )
        .map((command) => command.usageHelp)
        .join('`, \n`');
      message.reply(
        `## Available commands\n\`${formattedCommands}\`. \n\nSource code: [github.com/flagermeisters/meister-bot](<https://github.com/flagermeisters/meister-bot>)`,
      );
      return;
    }

    const command = this.commands.find(
      (command) => command.commandName === commandName,
    );

    if (!command) {
      message.reply(`Command \`${commandName}\` not found.`);
      return;
    }

    message.reply(
      `## Command \`${command.commandName}\`\nUsage: \`${command.usageHelp}\`\nDescription: ${command.commandDescription}`,
    );
  }
}

export default HelpCommand;
