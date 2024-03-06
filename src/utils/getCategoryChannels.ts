import { CategoryChannel, Message } from 'discord.js';

function getCategoryChannels(
  message: Message<true>,
  category: CategoryChannel,
) {
  return category.children.cache;
}

export { getCategoryChannels };
