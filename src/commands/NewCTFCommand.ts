import { ChannelType, Message } from "discord.js";
import BaseCommand from "./BaseCommand";

class NewCTFCommand extends BaseCommand {
  private adminRoleId: string;

  constructor(client: any, adminRoleId: string) {
    super(client);
    this.adminRoleId = adminRoleId;
  }

  async execute(message: Message<true>, args: string[]): Promise<void> {
    if (!this.hasRoleId(message, this.adminRoleId)) {
      message.reply("You do not have permission to use this command.");
      return;
    }

    const categoryName = args.join(" ");
    if (categoryName === "") {
      message.reply("Please specify a name for the CTF.");
      return;
    }

    try {
      const category = await message.guild!.channels.create({
        name: categoryName,
        type: ChannelType.GuildCategory,
      });

      const textChannel = await message.guild!.channels.create({
        name: categoryName,
        type: ChannelType.GuildText,
        parent: category.id,
      });

      await message.guild!.channels.create({
        name: categoryName,
        type: ChannelType.GuildVoice,
        parent: category.id,
      });

      message.reply(`New CTF <#${textChannel.id}> created.`);
    } catch (error) {
      console.error("Failed to create CTF channels:", error);
      message.reply("There was an error trying to create CTF channels.");
    }
  }
}

export default NewCTFCommand;
