import { assert } from 'console';
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
    assert(
      args.length === length,
      `Expected ${length} arguments, received ${args.length}`,
    );
  }

  assertArgsLengthRange(args: string[], min: number, max: number): void {
    assert(
      args.length >= min && args.length <= max,
      `Expected between ${min} and ${max} arguments, received ${args.length}`,
    );
  }

  assertNotInGeneralChannel(message: Message<true>): void {
    if (message.channel.parent?.name === 'general') {
      message.reply('Please use this command inside a challenge channel.');
      throw new Error('Command used in general channel');
    }
  }

  assertInTextChannel(message: Message<true>): void {
    if (!message.channel.isTextBased()) {
      message.reply('This command can only be used in a text channel.');
      throw new Error('Command used in non-text channel');
    }
  }
}

export default BaseCommand;
