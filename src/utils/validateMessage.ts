import { CategoryChannel, GuildTextBasedChannel, Message } from 'discord.js';
import { prefix } from '../const';

export interface ValidMemberMessage extends Message<true> {
  author: NonNullable<Message['author']>;
  member: NonNullable<Message['member']>;
  channel: GuildTextBasedChannel & {
    parent: CategoryChannel;
  };
}

export function validateMessage(
  message: Message,
): message is ValidMemberMessage {
  if (message.author.bot || !message.member) return false;
  if (!message.content.startsWith(prefix)) return false;
  if (!message.inGuild()) return false;
  if (!message.channel.parent) return false;

  return true;
}
