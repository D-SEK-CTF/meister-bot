import { Client, Message } from 'discord.js';

abstract class BaseCommand {
  client: Client;
  abstract commandName: string;
  abstract usageHelp: string;

  constructor(client: Client) {
    if (new.target === BaseCommand) {
      throw new TypeError('Cannot construct BaseCommand instances directly');
    }
    this.client = client;
  }

  abstract execute(message: Message, args: string[]): Promise<void>;

  hasRoleId(message: Message, id: string): boolean {
    return message.member
      ? message.member.roles.cache.some((role) => role.id === id)
      : false;
  }

  sendUsageHelp(message: Message): void {
    message.reply(`Usage: ${this.usageHelp}`);
  }

  assertArgsLength(args: string[], length: number): void {
    if (args.length !== length) {
      throw new Error(`Expected ${length} arguments, received ${args.length}`);
    }
  }

  assertArgsLengthRange(args: string[], min: number, max: number): void {
    if (args.length < min || args.length > max) {
      throw new Error(
        `Expected between ${min} and ${max} arguments, received ${args.length}`,
      );
    }
  }

  assertNotInGeneralChannel(message: Message<true>): void {
    if (message.channel.parent?.name === 'general') {
      throw new Error('Please use this command inside a challenge channel.');
    }
  }

  assertInTextChannel(message: Message<true>): void {
    if (!message.channel.isTextBased()) {
      throw new Error('This command can only be used in a text channel.');
    }
  }

  assertHasRole(message: Message<true>, roleId: string): void {
    if (!this.hasRoleId(message, roleId)) {
      throw new Error('You do not have permission to use this command.');
    }
  }
}

export default BaseCommand;
