import { Message } from 'discord.js';

function findChannelByName(message: Message<true>, channelName: string) {
  return message.guild.channels.cache.find(
    (channel) => channel.name === channelName,
  );
}

export { findChannelByName };
