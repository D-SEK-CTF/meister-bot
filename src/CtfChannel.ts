import {
  CategoryChannel,
  CategoryChildChannel,
  ChannelType,
  Collection,
  GuildTextBasedChannel,
  User,
} from 'discord.js';
import { ValidMemberMessage } from './utils/validateMessage';

const solvedChannelPrefix = '🚩｜';
const unsolvedChannelPrefix = '✍｜';
const emptyChannelPrefix = '🆕｜';
const discussionChannelName = '🗣️｜discussion';

class CtfChannel {
  category?: string;
  categoryObject: CategoryChannel;
  isDiscussion: boolean;
  channelObject: GuildTextBasedChannel;

  get rawName(): string {
    return this.channelObject.name;
  }

  get name(): string {
    return this.rawName
      .replace(solvedChannelPrefix, '')
      .replace(unsolvedChannelPrefix, '')
      .replace(emptyChannelPrefix, '');
  }

  get ref(): string {
    return `<#${this.channelObject.id}>`;
  }

  get isSolved(): boolean {
    return this.rawName.startsWith(solvedChannelPrefix);
  }

  get isUnsolved(): boolean {
    return this.rawName.startsWith(unsolvedChannelPrefix);
  }

  get isEmpty(): boolean {
    return this.rawName.startsWith(emptyChannelPrefix);
  }

  constructor(channel: GuildTextBasedChannel) {
    this.category = channel.parent?.name;
    this.channelObject = channel;
    this.isDiscussion = this.rawName === discussionChannelName;
    this.categoryObject = channel.parent as CategoryChannel;
  }

  static async createChall(
    name: string,
    category: CategoryChannel,
  ): Promise<CtfChannel> {
    const newChannel = await category.guild.channels.create({
      name,
      type: ChannelType.GuildText,
      parent: category.id,
    });
    const newCtfChannel = CtfChannel.fromChannel(newChannel);
    newCtfChannel.setEmptyName();
    newCtfChannel.moveToTop();
    return newCtfChannel;
  }

  static async createDiscussion(
    category: CategoryChannel,
  ): Promise<CtfChannel> {
    const newChannel = await category.guild.channels.create({
      name: discussionChannelName,
      type: ChannelType.GuildText,
      parent: category.id,
    });
    const newCtfChannel = CtfChannel.fromChannel(newChannel);
    newCtfChannel.setDiscussionName();
    return newCtfChannel;
  }

  static fromMessage(message: ValidMemberMessage): CtfChannel {
    return new CtfChannel(message.channel);
  }

  static fromChannel(channel: GuildTextBasedChannel): CtfChannel {
    return new CtfChannel(channel);
  }

  static fromChannelCache(
    channels: Collection<string, CategoryChildChannel>,
  ): CtfChannel[] {
    return channels
      .filter((channel) => channel.type === ChannelType.GuildText)
      .map((channel) => new CtfChannel(channel as GuildTextBasedChannel));
  }

  static fromName(
    name: string,
    category: CategoryChannel,
  ): CtfChannel | undefined {
    const channels = this.fromChannelCache(category.children.cache);
    const channel = channels.find(
      (channel) => channel.name.toLowerCase() === name.toLowerCase(),
    );

    return channel;
  }

  setSolvedName(): void {
    this.channelObject.setName(`${solvedChannelPrefix}${this.name}`);
  }

  setUnsolvedName(): void {
    this.channelObject.setName(`${unsolvedChannelPrefix}${this.name}`);
  }

  setEmptyName(): void {
    this.channelObject.setName(`${emptyChannelPrefix}${this.name}`);
  }

  setDiscussionName(): void {
    this.channelObject.setName(discussionChannelName);
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

  moveToTop(): void {
    if (
      this.channelObject.type === ChannelType.GuildText ||
      this.channelObject.type === ChannelType.GuildVoice
    ) {
      // Move the channel to under the general channel
      this.channelObject.setPosition(1);
    } else {
      throw new Error('Cannot move a non-text channel to the top.');
    }
  }

  moveToBottom(): void {
    if (
      this.channelObject.type === ChannelType.GuildText ||
      this.channelObject.type === ChannelType.GuildVoice
    ) {
      const lastPosition = this.categoryObject.children.cache.reduce(
        (acc, val) => Math.max(acc, val.position),
        0,
      );
      this.channelObject.setPosition(lastPosition);
    }
  }

  assertNotSolved(): void {
    if (this.isSolved) {
      throw new Error('Challenge is already solved.');
    }
  }

  assertSolved(): void {
    if (!this.isSolved) {
      throw new Error('Challenge is not solved.');
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
