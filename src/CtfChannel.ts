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
const discussionChannelName = '💬｜discussion';

class CtfChannel {
  category?: string;

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

  get isDiscussion(): boolean {
    return this.rawName === discussionChannelName;
  }

  get isChallengeChannel(): boolean {
    return this.name !== this.rawName;
  }

  constructor(channel: GuildTextBasedChannel) {
    this.category = channel.parent?.name;
    this.object = channel;
    this.categoryObject = channel.parent as CategoryChannel;
  }

  static async createChall(
    name: string,
    category: CtfCategory,
  ): Promise<CtfChannel> {
    const newCtfChannel = await CtfCategory.createChannel(
      CtfChannel.getEmptyName(name),
      category,
    );
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
      (channel) =>
        channel.name.toLowerCase() ===
        name.trim().replace(' ', '-').toLowerCase(),
    );

    return channel;
  }

  static getSolvedName(name: string): string {
    return `${solvedChannelPrefix}${name}`;
  }

  static getUnsolvedName(name: string): string {
    return `${unsolvedChannelPrefix}${name}`;
  }

  static getEmptyName(name: string): string {
    return `${emptyChannelPrefix}${name}`;
  }

  setSolvedName(): void {
    this.object.setName(CtfChannel.getSolvedName(this.name));
  }

  setUnsolvedName(): void {
    this.object.setName(CtfChannel.getUnsolvedName(this.name));
  }

  setEmptyName(): void {
    this.object.setName(CtfChannel.getEmptyName(this.name));
  }

  setDiscussionName(): void {
    this.object.setName(discussionChannelName);
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

  assertNotChallenge(): void {
    if (this.isChallengeChannel) {
      throw new Error(
        "Please don't use this command inside a challenge channel.",
      );
    }
  }

  assertNotInDiscussion(): void {
    if (this.isDiscussion) {
      throw new Error('Please use this command inside a challenge channel.');
    }
  }
}

export { CtfChannel };
