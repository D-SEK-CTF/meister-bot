import { Client, GatewayIntentBits } from 'discord.js';
import HelpCommand from './commands/HelpCommand';
import NewChallCommand from './commands/NewChallCommand';
import NewCTFCommand from './commands/NewCTFCommand';
import SolvedCommand from './commands/SolvedCommand';
import TestRoleCommand from './commands/TestRoleCommand';
import BaseCommand from './commands/BaseCommand';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const adminRoleID: string | undefined = process.env.ADMIN_ROLE_ID;
const botToken: string | undefined = process.env.DISCORD_BOT_TOKEN;
const prefix: string = process.env.PREFIX ?? 'meister';

if (!adminRoleID) {
  console.error('ADMIN_ROLE_ID is not defined in your environment variables.');
  process.exit(1);
} else if (!botToken) {
  console.error('DISCORD_BOT_TOKEN is not defined in your environment variables.');
  process.exit(1);
}

client.once('ready', () => {
  console.log('Meister is ready!');
});

interface CommandMap {
  [key: string]: BaseCommand;
}

const commands: CommandMap = {
  help: new HelpCommand(client),
  "new chall": new NewChallCommand(client, adminRoleID),
  "new ctf": new NewCTFCommand(client, adminRoleID),
  solved: new SolvedCommand(client),
  testrole: new TestRoleCommand(client, adminRoleID),
};

client.on('messageCreate', (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith(prefix)) {
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase() ?? '';

    const command = commands[commandName];
    if (command) {
      command.execute(message, args);
    } else {
      const similarCommands = Object.keys(commands).filter((cmd) =>
        cmd.includes(commandName)
      );
      if (similarCommands.length > 0) {
        message.reply(`Did you mean ${similarCommands.join(", ")}?`);
      } else {
        message.reply("I don't understand that command.");
      }
    }
  }
});

client.login(botToken).catch(console.error);
