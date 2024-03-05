import { prefix } from "../const";
import BaseCommand from "./BaseCommand";
import { ChannelType, Message } from "discord.js";

class NewChallCommand extends BaseCommand {
  private adminRoleId: string;
  commandName = "new chall";
  usageHelp = `${prefix} ${this.commandName} <CHALL-NAME>`

  constructor(client: any, adminRoleId: string) {
    super(client);
    this.adminRoleId = adminRoleId;
  }

  async execute(message: Message<true>, args: string[]): Promise<void> {
    if (!this.hasRoleId(message, this.adminRoleId)) {
      message.reply("You do not have permission to use this command.");
      return;
    }

    const channelName = args.join(" ");
    if (channelName === "") {
      message.reply("Please specify a name for the challenge.");
      return;
    }

    const category = message.channel.parent;
    if (!category || category.type !== ChannelType.GuildCategory) {
      message.reply("Please use this command inside a category.");
      return;
    }

    try {
      const newChannel = await message.guild.channels.create({
        name: channelName,
        type: ChannelType.GuildText,
        parent: category.id,
      });

      message.channel.send(`New challenge <#${newChannel.id}> created inside ${category.name}.`);
    } catch (error) {
      console.error("Failed to create challenge channel:", error);
      message.reply("There was an error trying to create the challenge channel.");
    }
  }
}

export default NewChallCommand;
