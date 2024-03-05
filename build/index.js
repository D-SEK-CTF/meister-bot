"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
var fast_fuzzy_1 = require("fast-fuzzy");
var NewCTFCommand_1 = __importDefault(require("./commands/NewCTFCommand"));
var NewChallCommand_1 = __importDefault(require("./commands/NewChallCommand"));
var SolvedCommand_1 = __importDefault(require("./commands/SolvedCommand"));
var TestRoleCommand_1 = __importDefault(require("./commands/TestRoleCommand"));
var const_1 = require("./const");
var client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
    ],
});
if (!const_1.adminRoleID) {
    console.error('ADMIN_ROLE_ID is not defined in your environment variables.');
    process.exit(1);
}
else if (!const_1.botToken) {
    console.error('DISCORD_BOT_TOKEN is not defined in your environment variables.');
    process.exit(1);
}
client.once('ready', function () {
    console.log('Meister is ready!');
});
var commands = [
    new NewChallCommand_1.default(client, const_1.adminRoleID),
    new NewCTFCommand_1.default(client, const_1.adminRoleID),
    new SolvedCommand_1.default(client),
    new TestRoleCommand_1.default(client, const_1.adminRoleID),
];
var commandNames = commands.map(function (command) { return command.commandName; });
var helpCommands = commands.map(function (command) { return command.usageHelp; });
client.on('messageCreate', function (message) {
    if (message.author.bot)
        return;
    if (!message.content.startsWith(const_1.prefix))
        return;
    if (!message.inGuild())
        return;
    var botCommand = message.content.slice(const_1.prefix.length).trim().toLocaleLowerCase();
    // Exact matching with early return
    for (var _i = 0, _a = Object.values(commands); _i < _a.length; _i++) {
        var command = _a[_i];
        if (botCommand.startsWith(command.commandName)) {
            console.log("Executing command: ".concat(command.commandName));
            var args = botCommand.slice(command.commandName.length).trim().split(/ +/);
            command.execute(message, args);
            return;
        }
    }
    // Help command
    if (botCommand === 'help') {
        message.reply("Available commands: `".concat(helpCommands.join('\`, \`'), "`.\n\nType `").concat(const_1.prefix, " help <command>` for more info."));
        return;
    }
    // Fuzzy matching
    var searcher = new fast_fuzzy_1.Searcher(Object.keys(commands));
    var matches = searcher.search(botCommand);
    var response = 'Invalid command.';
    if (matches.length > 0) {
        response += " Did you mean: `".concat(matches.join('\`, \`'), "`?");
    }
    message.reply(response);
});
client.login(const_1.botToken).catch(console.error);
