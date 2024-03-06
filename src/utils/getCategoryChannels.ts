import {
  CategoryChannel,
  ForumChannel,
  MediaChannel,
  Message,
  NewsChannel,
  TextChannel,
} from 'discord.js';

function getCategoryChannels(
  message: Message<true>,
  category: CategoryChannel,
) {
  return category.children.cache;
}

export { getCategoryChannels };
