import { Client, GatewayIntentBits } from 'discord.js';
import { Searcher } from 'fast-fuzzy';
import NewCTFCommand from './commands/NewCTFCommand';
import NewChallCommand from './commands/NewChallCommand';
import SolvedCommand from './commands/SolvedCommand';
import TestRoleCommand from './commands/TestRoleCommand';
import { adminRoleID, botToken, prefix } from './const';
import { validateMessage } from './utils/validateMessage';

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
];
const commandNames = commands.map((command) => command.commandName);
const helpCommands = commands.map((command) => command.usageHelp);

client.once('ready', () => {
  console.log('Meister is ready!');
});

client.on('messageCreate', (message) => {
  if (!validateMessage(message)) return;

  const botCommand = message.content
    .slice(prefix.length)
    .trim()
    .toLocaleLowerCase();

  // Exact matching with early return
  for (const command of Object.values(commands)) {
    if (botCommand.startsWith(command.commandName)) {
      const args = botCommand
        .slice(command.commandName.length)
        .trim()
        .split(/ +/)
        .filter(Boolean);
      command.execute(message, args).catch((error) => {
        // NOTE: This mainly handles assertion errors with custom messages
        console.error(error);
        message.reply(error.message);
      });
      return;
    }
  }

  // Help command
  if (botCommand === 'help') {
    message.reply(
      `## Available commands\n\`${helpCommands.join(
        '`, \n`',
      )}\`. \n\nSource code: [github.com/flagermeisters/meister-bot](https://github.com/flagermeisters/meister-bot)`,
    );
    return;
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
