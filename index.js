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
const adminRoleID = process.env.ADMIN_ROLE_ID;

client.once("ready", () => {
  console.log("Meister is ready!");
});

const helpMsg = `
### Help Page
Testing
  meister testrole
Creating new ctfs:
  meister new ctf <CTF-NAME>
  mesiter new chall <CHALL-NAME>
`;
const hasRoleId = (message, id) => {
  const member = message.member;
  if (member.roles.cache.some((role) => role.id === id)) {
    return true;
  } else {
    return false;
  }
};

client.on("messageCreate", (message) => {
  // Ignore messages from other bots
  if (message.author.bot) return;

  // Check if the message starts with the specified prefix
  if (message.content.startsWith(prefix)) {
    // Split the message into an array of words
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // Help
    if (command == "" || command == "help") {
      message.reply(helpMsg);
    }

    if (command == "testrole") {
      const userName = message.member.user.username;
      if (hasRoleId(message, adminRoleID)) {
        message.reply("User " + userName + " is allowed");
      } else {
        message.reply("User " + userName + " is NOT allowed");
      }
    }

    // Check the command
    if (command === "new" && hasRoleId(message, adminRoleID)) {
      const subCommand = args.shift().toLowerCase();
      if (subCommand === "ctf") {
        // Create a new category
        const categoryName = args.join(" ");

        if (categoryName === "") {
          message.channel.send("Please specify a name for the CTF.");
          return;
        }

        message.guild.channels
          .create({
            name: categoryName,
            type: ChannelType.GuildCategory,
          })
          .then((category) => {
            message.guild.channels
              .create({
                name: categoryName,
                type: ChannelType.GuildText,
                parent: category.id,
              })
              .then((textChannel) => {
                // Send a message to the channel
                message.reply(`New CTF <#${textChannel.id}> created.`);
              });
            message.guild.channels.create({
              name: categoryName,
              type: ChannelType.GuildVoice,
              parent: category.id,
            });
          });
      } else if (subCommand === "chall" && hasRoleId(message, adminRoleID)) {
        // Create a new channel inside the specified category
        if (args.length === 0) {
          message.reply("Please specify a name for the challenge.");
        }
        const channelName = args.join(" ");
        const category = message.channel.parent;
        if (category && category.type === ChannelType.GuildCategory) {
          message.guild.channels
            .create({
              name: channelName,
              type: ChannelType.GuildText,
              parent: category.id,
            })
            .then((newChannel) => {
              // Now mentioning the newly created channel inside the specified category
              message.channel.send(
                `New channel <#${newChannel.id}> created inside ${category.name}.`
              );
            });
        } else {
          message.reply("Please use this command inside a category.");
        }
      }
    } else if (command === "solved") {
      // Change the channel name to include a checkmark
      const solvedString = args.join(" ");
      const newChannelName = `${message.channel.name} ✅`;
      message.channel.setName(newChannelName);
      message.reply(`Challenge solved: \`${solvedString}\``);
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN).then((e) => console.log(e));
