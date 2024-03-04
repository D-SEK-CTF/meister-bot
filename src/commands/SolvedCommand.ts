import { Message } from 'discord.js';
import BaseCommand from './BaseCommand';
import { prefix } from '../const';

class SolvedCommand extends BaseCommand {
  commandName = 'solved';
  usageHelp = `${prefix} ${this.commandName} <CHALL-NAME>`;

  async execute(message: Message<true>, args: string[]): Promise<void> {
    const solvedString = args.join(' ');
    const newChannelName = `${message.channel.name} ✅`;

    if ('setName' in message.channel) {
      try {
        await message.channel.setName(newChannelName);
        message.reply(`Challenge solved: \`${solvedString}\``);
      } catch (error) {
        console.error('Failed to rename channel:', error);
        message.reply('There was an error trying to mark the challenge as solved.');
      }
    } else {
      message.reply('This command can only be used in a text channel.');
    }
  }
}

export default SolvedCommand;
