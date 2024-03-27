import {
  CategoryChannel,
  ChannelType,
  GuildTextBasedChannel,
  User,
} from 'discord.js';
import { ValidMemberMessage } from './utils/validateMessage';

const solvedChannelPrefix = '🚩｜';
const unsolvedChannelPrefix = '✍️｜';
const emptyChannelPrefix = '🆕｜';
const discussionChannelName = '🗣️｜discussion';

class CtfChannel {
  name: string;
  rawName: string;
  category?: string;
  categoryObject: CategoryChannel;
  isDiscussion: boolean;
  isSolved: boolean;
  isUnsolved: boolean;
  isEmpty: boolean;
  channelObject: GuildTextBasedChannel;

  constructor(channel: GuildTextBasedChannel) {
    this.rawName = channel.name;
    this.category = channel.parent?.name;
    this.isDiscussion = this.rawName === discussionChannelName;
    this.isSolved = this.rawName.startsWith(solvedChannelPrefix);
    this.isUnsolved = this.rawName.startsWith(unsolvedChannelPrefix);
    this.isEmpty = this.rawName.startsWith(emptyChannelPrefix);
    this.channelObject = channel;
    this.categoryObject = channel.parent as CategoryChannel;

    this.name = this.rawName
      .replace(solvedChannelPrefix, '')
      .replace(unsolvedChannelPrefix, '')
      .replace(emptyChannelPrefix, '');
  }

  setSolvedName(): void {
    this.channelObject.setName(`${solvedChannelPrefix}${this.name}`);
  }

  setUnsolved(): void {
    this.channelObject.setName(`${unsolvedChannelPrefix}${this.name}`);
  }

  setEmptyName(): void {
    this.channelObject.setName(`${emptyChannelPrefix}${this.name}`);
  }

  isGeneral(): boolean {
    return this.category === 'general';
  }

  setTopic(topic: string): void {
    if (!this.channelObject.isThread() && !this.channelObject.isVoiceBased())
      this.channelObject.setTopic(topic);
  }

  participatingMembers(): User[] {
    // Gets all members who have sent a message in the channel
    const authors = this.channelObject.messages.cache.map(
      (message) => message.author,
    );
    const members = new Set<User>();

    authors
      .filter((author) => !author.bot)
      .forEach((author) => {
        members.add(author);
      });

    return Array.from(members);
  }

  moveToBottom(): void {
    if (
      this.channelObject.type === ChannelType.GuildText ||
      this.channelObject.type === ChannelType.GuildVoice
    ) {
      const lastPosition = this.categoryObject.children.cache.last()!.position;
      this.channelObject.setPosition(lastPosition);
    }
  }

  assertNotSolved(): void {
    if (this.isSolved) {
      throw new Error('Challenge is already solved.');
    }
  }

  assertNotInGeneral(): void {
    if (this.isGeneral()) {
      throw new Error('Please use this command inside a challenge category.');
    }
  }

  assertNotInDiscussion(): void {
    if (this.isDiscussion) {
      throw new Error('Please use this command inside a challenge channel.');
    }
  }
}

export { CtfChannel };
