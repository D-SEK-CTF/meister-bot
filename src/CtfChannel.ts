import {
  CategoryChannel,
  CategoryChildChannel,
  ChannelType,
  Collection,
  GuildTextBasedChannel,
  User,
} from 'discord.js';
import { ValidMemberMessage } from './utils/validateMessage';
import { CtfCategory } from './CtfCategory';

const solvedChannelPrefix = '🚩｜';
const unsolvedChannelPrefix = '✍｜';
const emptyChannelPrefix = '🆕｜';
const discussionChannelName = '🗣️｜discussion';

class CtfChannel {
  category?: string;
  isDiscussion: boolean;

  private categoryObject: CategoryChannel;
  private object: GuildTextBasedChannel;

  get rawName(): string {
    return this.object.name;
  }

  get name(): string {
    return this.rawName
      .replace(solvedChannelPrefix, '')
      .replace(unsolvedChannelPrefix, '')
      .replace(emptyChannelPrefix, '');
  }

  get ref(): string {
    return `<#${this.object.id}>`;
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
    this.object = channel;
    this.isDiscussion = this.rawName === discussionChannelName;
    this.categoryObject = channel.parent as CategoryChannel;
  }

  static async createChall(
    name: string,
    category: CtfCategory,
  ): Promise<CtfChannel> {
    const newCtfChannel = await CtfCategory.createChannel(name, category);
    newCtfChannel.setEmptyName();
    newCtfChannel.moveToTop();
    return newCtfChannel;
  }

  static async createDiscussion(category: CtfCategory): Promise<CtfChannel> {
    return await CtfCategory.createChannel(discussionChannelName, category);
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

  static fromName(name: string, category: CtfCategory): CtfChannel | undefined {
    const channels = this.fromChannelCache(category.children);
    const channel = channels.find(
      (channel) => channel.name.toLowerCase() === name.toLowerCase(),
    );

    return channel;
  }

  setSolvedName(): void {
    this.object.setName(`${solvedChannelPrefix}${this.name}`);
  }

  setUnsolvedName(): void {
    this.object.setName(`${unsolvedChannelPrefix}${this.name}`);
  }

  setEmptyName(): void {
    this.object.setName(`${emptyChannelPrefix}${this.name}`);
  }

  setDiscussionName(): void {
    this.object.setName(discussionChannelName);
  }

  isGeneral(): boolean {
    return this.category === 'general';
  }

  setTopic(topic: string): void {
    if (!this.object.isThread() && !this.object.isVoiceBased())
      this.object.setTopic(topic);
  }

  participatingMembers(): User[] {
    // Gets all members who have sent a message in the channel
    const authors = this.object.messages.cache.map((message) => message.author);
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
      this.object.type === ChannelType.GuildText ||
      this.object.type === ChannelType.GuildVoice
    ) {
      // Move the channel to under the general channel
      this.object.setPosition(1);
    } else {
      throw new Error('Cannot move a non-text channel to the top.');
    }
  }

  moveToBottom(): void {
    if (
      this.object.type === ChannelType.GuildText ||
      this.object.type === ChannelType.GuildVoice
    ) {
      const lastPosition = this.categoryObject.children.cache.reduce(
        (acc, val) => Math.max(acc, val.position),
        0,
      );
      this.object.setPosition(lastPosition);
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
