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

const adminRoleID = process.env.ADMIN_ROLE_ID

client.once("ready", () => {
  console.log("Meister is ready!");
});

const helpMsg = `
### Help Page
Testing
  meister testrole
Creating new ctfs:
  meister new ctf <CTF-NAME>
  mesiter new chall <CTF-NAME> <CHALL-NAME>
`
const hasRoleId = (message,id)=>{
  const member = message.member;
  if (member.roles.cache.some(role => role.id === id)) {
    return true
  }else{
    const userName = message.member.user.globalName
    message.channel.send("User " +userName + " invalid permissions")
    return false
  }
}

function findCategoryByName(guild, categoryName) {
  // Filter the channels to find the category with the given name
  const category = guild.channels.cache.find(channel => 
    channel.type==ChannelType.GuildCategory && channel.name.toLowerCase() == categoryName
  );
  return category; // This will be undefined if no category is found
}

client.on("messageCreate", (message) => {
  // Ignore messages from other bots
  if (message.author.bot) return;

  // Check if the message starts with the specified prefix
  if (message.content.startsWith(prefix)) {
    // Split the message into an array of words
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    switch (command) {
      // Help
      case "help":
      case "":
      message.channel.send(helpMsg)
        break;
      
      case "testrole":
        const userName = message.member.user.globalName
        if (hasRoleId(message,adminRoleID)){
          message.channel.send("User " + userName + " is allowed")
        }else{
          message.channel.send("User " +userName + " is NOT allowed")
        }
        break;
      case "new":
        const subCommand = args.shift().toLowerCase();
        switch (subCommand) {
          case "ctf":
            // Permission check
            if (!hasRoleId(message,adminRoleID)){
              break;
            }

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
          break;
          case "chall":
            // Create a new channel inside the specified category
            const ctfName = args.shift().toLowerCase();
            const challName = args.join(" ");
            const category = findCategoryByName(message.guild,ctfName);

            if (category && category.type === ChannelType.GuildCategory && category.name != "general") {
              message.guild.channels.create({
                name: challName,
                type: ChannelType.GuildText,
                parent: category,
              });
              message.channel.send(
                `New channel '${challName}' created inside '${category.name}'.`
              );
            } else {
              message.channel.send("Make sure ctf category exists");
              message.channel.send("Usage: meister new chall <CTF_NAME> <CHALL_NAME>");
            }
        default:
          break;
      }
      case "solved":
        const parent = message.channel.parent
        if (parent.name != "general"){        
          const newChannelName = `${message.channel.name} ✅`;
          message.channel.setName(newChannelName);
          message.channel.send(`Challenge solved: \`${message.channel.name}\``);
        }
        break;
      default:
        message.channel.send("Command not found: "+ command)
        break;
    }
  }

});

client.login(process.env.DISCORD_BOT_TOKEN).then((e) => console.log(e));
