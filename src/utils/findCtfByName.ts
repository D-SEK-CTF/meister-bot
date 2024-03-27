import { CategoryChannel, ChannelType, Guild } from 'discord.js';

function findCtfByName(
  guild: Guild,
  ctfName: string,
  assertNotExists = false,
): CategoryChannel {
  const categories = guild.channels.cache.filter(
    (channel) => channel.type === ChannelType.GuildCategory,
  );
  const category = categories.find(
    (channel) => channel.name.toLowerCase() === ctfName.toLowerCase(),
  );

  if (assertNotExists && !category) {
    throw new Error(`CTF ${ctfName} not found.`);
  }

  return category as CategoryChannel;
}

export { findCtfByName };
