import { Client } from 'discord.js';
import { prefix } from '../const';
import { ValidMemberMessage } from '../utils/validateMessage';
import Command from './BaseCommand';
import { CtfChannel } from '../CtfChannel';
import fuzzyMatch from '../utils/fuzzyMatch';
import { CtfCategory } from '../CtfCategory';

class HelpCommand extends Command {
  commandName = 'help';
  usageHelp = `${prefix} ${this.commandName} ["all" | COMMAND-NAME]`;
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
    commandChannel: CtfChannel,
    commandCategory: CtfCategory,
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
      const matches = fuzzyMatch(commandName, this.commandNames);
      if (matches.length === 0) {
        throw Error(`Command \`${commandName}\` not found.`);
      } else {
        throw Error(
          `Command \`${commandName}\` not found. Did you mean \`${matches.join(
            '`, `',
          )}\`?`,
        );
      }
    }

    message.reply(
      `## Command \`${command.commandName}\`\nUsage: \`${command.usageHelp}\`\nDescription: ${command.commandDescription}`,
    );
  }
}

export default HelpCommand;
