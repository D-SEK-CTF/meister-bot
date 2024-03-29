import {
  CategoryChannel,
  CategoryChildChannel,
  ChannelType,
  Collection,
  Guild,
  GuildBasedChannel,
  GuildTextBasedChannel,
} from 'discord.js';
import { ValidMemberMessage } from './utils/validateMessage';
import { CtfChannel } from './CtfChannel';

const archivedSuffix = ' (archived)';
const generalCategoryName = 'category';

class CtfCategory {
  object: CategoryChannel;
  isGeneral: boolean;

  get rawName(): string {
    return this.object.name;
  }

  get name(): string {
    return this.rawName.replace(archivedSuffix, '');
  }

  get isArchived(): boolean {
    return this.rawName.endsWith(archivedSuffix);
  }

  get children(): Collection<string, CategoryChildChannel> {
    return this.object.children.cache;
  }

  constructor(category: CategoryChannel) {
    this.object = category;
    this.isGeneral = this.rawName === generalCategoryName;
  }

  static async createCTF(name: string, guild: Guild): Promise<CtfCategory> {
    const newCategory = await guild.channels.create({
      name,
      type: ChannelType.GuildCategory,
    });
    return new CtfCategory(newCategory);
  }

  static async createChannel(
    name: string,
    category: CtfCategory,
  ): Promise<CtfChannel> {
    const challCategory = await category.object.guild.channels.create({
      name,
      type: ChannelType.GuildText,
      parent: category.object,
    });

    return CtfChannel.fromChannel(challCategory);
  }

  static fromMessage(message: ValidMemberMessage): CtfCategory {
    return new CtfCategory(message.channel.parent);
  }

  static fromChannel(channel: GuildTextBasedChannel): CtfCategory {
    return new CtfCategory(channel.parent as CategoryChannel);
  }

  static fromCategory(category: CategoryChannel): CtfCategory {
    return new CtfCategory(category);
  }

  static fromCategoryCache(
    categories: Collection<string, GuildBasedChannel>,
  ): CtfCategory[] {
    return categories
      .filter((category) => category.type === ChannelType.GuildCategory)
      .map((category) => new CtfCategory(category as CategoryChannel));
  }

  static fromName(name: string, guild: Guild, assertExists: true): CtfCategory;
  static fromName(
    name: string,
    guild: Guild,
    assertExists?: false,
  ): CtfCategory | undefined;

  static fromName(
    name: string,
    guild: Guild,
    assertExists = false,
  ): CtfCategory | undefined {
    const categories = this.fromCategoryCache(guild.channels.cache);
    const category = categories.find(
      (category) => category.name.toLowerCase() === name.toLowerCase(),
    );

    if (assertExists && !category) {
      throw new Error(`Category \`${name}\` not found.`);
    }

    return category;
  }

  setArchivedName(): void {
    this.object.setName(`${this.name}${archivedSuffix}`);
  }

  setReadOnly(): void {
    this.children.forEach((channel) => {
      channel.permissionOverwrites.edit(this.object.guild.roles.everyone, {
        SendMessages: false,
      });
    });
  }

  moveToTop(): void {
    this.object.setPosition(1);
  }

  moveToArchivedPosition(): void {
    const categories = this.object.guild.channels.cache.filter(
      (channel) => channel.type === ChannelType.GuildCategory,
    ) as Collection<string, CategoryChannel>;

    const archivedCategories = categories.filter((category) =>
      category.name.endsWith(archivedSuffix),
    );

    if (archivedCategories.size === 0) {
      this.object.setPosition(categories.size);
      return;
    }

    const archivedCategoryPositions = archivedCategories.map(
      (category) => category.position,
    );
    const lowestPosition = Math.min(...archivedCategoryPositions);
    this.object.setPosition(lowestPosition - 1);
  }

  moveToBottom(): void {
    const lastPosition = this.object.children.cache.reduce(
      (acc, val) => Math.max(acc, val.position),
      0,
    );
    this.object.setPosition(lastPosition);
  }

  assertNotInGeneral(): void {
    if (this.isGeneral) {
      throw new Error('Please use this command inside a challenge category.');
    }
  }

  assertNotArchived(): void {
    if (this.isArchived) {
      throw new Error('Category is already archived.');
    }
  }
}

export { CtfCategory };
