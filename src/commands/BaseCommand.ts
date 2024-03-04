import { Client, Message } from 'discord.js';

abstract class BaseCommand {
  client: Client;
  prefix: string;

  constructor(client: Client) {
    if (new.target === BaseCommand) {
      throw new TypeError("Cannot construct BaseCommand instances directly");
    }
    this.client = client;
    this.prefix = "meister";
  }

  abstract execute(message: Message, args: string[]): void;

  hasRoleId(message: Message, id: string): boolean {
    const member = message.member;
    return member ? member.roles.cache.some((role) => role.id === id) : false;
  }
}

export default BaseCommand;