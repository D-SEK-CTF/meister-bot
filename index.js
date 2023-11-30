import "dotenv/config";
import { ChannelType, Client, GatewayIntentBits } from "discord.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
const prefix = "meister";

client.once("ready", () => {
  console.log("Meister is ready!");
});

client.on("messageCreate", (message) => {
  // Ignore messages from other bots
  if (message.author.bot) return;

  // Check if the message starts with the specified prefix
  if (message.content.startsWith(prefix)) {
    // Split the message into an array of words
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // Check the command
    if (command === "new") {
      const subCommand = args.shift().toLowerCase();

      if (subCommand === "ctf") {
        // Create a new category
        const categoryName = args.join(" ");
        message.guild.channels
          .create({
            name: categoryName,
            type: ChannelType.GuildCategory,
          })
          .then((e) => {
            message.guild.channels.create({
              name: categoryName,
              type: ChannelType.GuildText,
              parent: e.id,
            });
            message.guild.channels.create({
              name: categoryName,
              type: ChannelType.GuildVoice,
              parent: e.id,
            });
          });
        message.channel.send(`New CTF '${categoryName}' created.`);
      } else if (subCommand === "chall") {
        // Create a new channel inside the specified category
        const channelName = args.join(" ");
        const category = message.channel.parent;
        if (category && category.type === ChannelType.GuildCategory) {
          message.guild.channels.create({
            name: channelName,
            type: ChannelType.GuildText,
            parent: category,
          });
          message.channel.send(
            `New channel '${channelName}' created inside '${category.name}'.`
          );
        } else {
          message.channel.send("Please use this command inside a category.");
        }
      }
    } else if (command === "solved") {
      // Change the channel name to include a checkmark
      const solvedString = args.join(" ");
      const newChannelName = `${message.channel.name} ✅`;
      message.channel.setName(newChannelName);
      message.channel.send(`Challenge solved: \`${solvedString}\``);
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN).then((e) => console.log(e));
