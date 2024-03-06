import { ChannelType, Message } from 'discord.js';

function findChannelByName(
  message: Message<true>,
  channelName: string,
  type?: ChannelType,
) {
  return message.guild.channels.cache.find(
    (channel) =>
      channel.name === channelName && (!type || channel.type === type),
  );
}

export { findChannelByName };
