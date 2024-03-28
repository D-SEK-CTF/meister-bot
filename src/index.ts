import { Client, GatewayIntentBits } from 'discord.js';
import { Searcher } from 'fast-fuzzy';
import ArchiveCommand from './commands/ArchiveCommand';
import NewCTFCommand from './commands/NewCTFCommand';
import NewChallCommand from './commands/NewChallCommand';
import SolvedCommand from './commands/SolvedCommand';
import TestRoleCommand from './commands/TestRoleCommand';
import { adminRoleID, botToken, prefix } from './const';
import { validateMessage } from './utils/validateMessage';
import HelpCommand from './commands/HelpCommand';
import BaseCommand from './commands/BaseCommand';
import { CtfChannel } from './CtfChannel';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

if (!adminRoleID) {
  console.error('ADMIN_ROLE_ID is not defined in your environment variables.');
  process.exit(1);
} else if (!botToken) {
  console.error(
    'DISCORD_BOT_TOKEN is not defined in your environment variables.',
  );
  process.exit(1);
}

const commands = [
  new NewChallCommand(client, adminRoleID),
  new NewCTFCommand(client, adminRoleID),
  new SolvedCommand(client),
  new TestRoleCommand(client, adminRoleID),
  new ArchiveCommand(client, adminRoleID),
];
commands.push(new HelpCommand(client, adminRoleID, commands));
const commandNames = commands.map((command) => command.commandName);

client.once('ready', () => {
  console.log('Meister is ready!');
});

client.on('messageCreate', (message) => {
  if (message.author.bot || !message.member) return;
  if (!message.inGuild()) return;
  if (!message.channel.parent) return;

  const channel = new CtfChannel(message.channel);
  if (!channel.isEmpty) return;

  channel.setUnsolvedName();
});

client.on('messageCreate', (message) => {
  if (!validateMessage(message)) return;

  const botCommand = message.content.slice(prefix.length).trim();
  const botCommandLower = botCommand.toLowerCase();

  // Exact matching with early return
  for (const command of Object.values(commands)) {
    if (botCommandLower.startsWith(command.commandName)) {
      const argString = botCommand.slice(command.commandName.length).trim();
      command.handleCommand(message, argString);
      return;
    }
  }

  // Fuzzy matching
  const commandName = botCommand.split(' ')[0];
  const searcher = new Searcher(commandNames);
  const matches = searcher.search(commandName, {
    threshold: 0.5,
  });
  let response = 'Invalid command.';
  if (matches.length > 0) {
    response += ` Did you mean: \`${matches.join('`, `')}\`?`;
  }
  message.reply(response);
});

client.login(botToken).catch(console.error);
