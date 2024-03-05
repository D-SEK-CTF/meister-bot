import { Client, GatewayIntentBits } from 'discord.js';
import { Searcher } from 'fast-fuzzy';
import NewCTFCommand from './commands/NewCTFCommand';
import NewChallCommand from './commands/NewChallCommand';
import SolvedCommand from './commands/SolvedCommand';
import TestRoleCommand from './commands/TestRoleCommand';
import { adminRoleID, botToken, prefix } from './const';

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

client.once('ready', () => {
  console.log('Meister is ready!');
});

const commands = [
  new NewChallCommand(client, adminRoleID),
  new NewCTFCommand(client, adminRoleID),
  new SolvedCommand(client),
  new TestRoleCommand(client, adminRoleID),
];
const commandNames = commands.map((command) => command.commandName);
const helpCommands = commands.map((command) => command.usageHelp);

client.on('messageCreate', (message) => {
  try {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    if (!message.inGuild()) return;

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
        `Available commands: \`${helpCommands.join(
          '`, `',
        )}\`.\n\nType \`${prefix} help <command>\` for more info.`,
      );
      return;
    }

    // Fuzzy matching
    const searcher = new Searcher(Object.keys(commands));
    const matches = searcher.search(botCommand);
    let response = 'Invalid command.';
    if (matches.length > 0) {
      response += ` Did you mean: \`${matches.join('`, `')}\`?`;
    }
    message.reply(response);
  } catch (error) {
    console.error('Error:', error);
  }
});

client.login(botToken).catch(console.error);
