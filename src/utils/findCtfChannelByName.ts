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
import { CtfChannel } from '../CtfChannel';
import { ValidMemberMessage } from './validateMessage';

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

function findCtfChannelByName<T extends ChannelType>(
  category: CategoryChannel,
  channelName: string,
  type?: T,
  assertNotExists = false,
): MappedChannelTypes[T] {
  const channels = category.children.cache.map(
    (channel) => new CtfChannel(channel as ValidMemberMessage['channel']),
  );
  const channel = channels.find(
    (channel) =>
      channel.name.toLowerCase() === channelName.toLowerCase() &&
      (!type || channel.channelObject.type === type),
  );

  if (assertNotExists && channel) {
    throw new Error(`Channel \`${channelName}\` already exists.`);
  }

  return channel?.channelObject as MappedChannelTypes[T];
}

export { findCtfChannelByName };
