import { Message } from 'discord.js';
import BaseCommand from "./BaseCommand"

const helpMsg = `### Help Page
Testing
  meister testrole
Creating new ctfs:
  meister new ctf <CTF-NAME>
  mesiter new chall <CHALL-NAME>`;

class HelpCommand extends BaseCommand {
  execute(message: Message<true>, args: string[]): void {
    message.reply(helpMsg);
  }
}

export default HelpCommand;