import {
  CategoryChannel,
  ChannelType,
  DMChannel,
  MappedGuildChannelTypes,
  Message,
  StageChannel,
  TextChannel,
  VoiceChannel,
} from 'discord.js';

type MappedChannelTypes = {
  [ChannelType.GuildText]: TextChannel;
  [ChannelType.DM]: DMChannel;
  [ChannelType.GuildVoice]: VoiceChannel;
  [ChannelType.GroupDM]: DMChannel;
  [ChannelType.GuildCategory]: CategoryChannel;
  [ChannelType.GuildStageVoice]: StageChannel;
  [ChannelType.GuildNewsThread]: TextChannel;
  [ChannelType.GuildPublicThread]: TextChannel;
  [ChannelType.GuildPrivateThread]: TextChannel;
  [ChannelType.GuildDirectory]: TextChannel;
} & MappedGuildChannelTypes;

function findChannelByName<T extends ChannelType>(
  message: Message<true>,
  channelName: string,
  type?: T,
  assertNotExists = false,
): MappedChannelTypes[T] {
  const channel = message.guild.channels.cache.find(
    (channel) =>
      channel.name.toLowerCase() === channelName.toLowerCase() &&
      (!type || channel.type === type),
  );

  if (assertNotExists && !channel) {
    throw new Error(`Channel ${channelName} not found.`);
  }

  return channel as MappedChannelTypes[T];
}

export { findChannelByName };
