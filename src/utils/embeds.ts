import { ChatInputCommandInteraction, Colors, EmbedBuilder, Guild, GuildMember, User } from 'discord.js';

import { capitalize } from './string';

interface EmbedOperation {
  embed: EmbedBuilder;
  error: (description: string) => EmbedOperation;
  gray: (description: string) => EmbedOperation;
  info: (description: string) => EmbedOperation;
  success: (description: string) => EmbedOperation;
  warn: (description: string) => EmbedOperation;
}

interface PlaylistEmbedOptions {
  color?: number;
  description: string;
  thumbnail?: string;
  user: GuildMember;
}

export function createErrorEmbed(user: GuildMember, message: string): EmbedBuilder {
  return createPlaylistEmbed({
    color: Colors.Red,
    description: `❌ 加入播放清單失敗：${message}`,
    user,
  });
}
export function createPlaylistEmbed({
  color = Colors.Blue,
  description,
  thumbnail,
  user,
}: PlaylistEmbedOptions): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setColor(color)
    .setAuthor({
      iconURL: user.displayAvatarURL() ?? undefined,
      name: `播放清單 | ${user.displayName}`,
    })
    .setDescription(description)
    .setTimestamp();

  if (thumbnail) {
    embed.setThumbnail(thumbnail);
  }

  return embed;
}

export function guild(interaction: ChatInputCommandInteraction<'cached'>): EmbedOperation;
export function guild(guild: Guild, title: string): EmbedOperation;
export function guild(guild: ChatInputCommandInteraction<'cached'> | Guild, title?: string): EmbedOperation {
  if (guild instanceof ChatInputCommandInteraction) {
    title = guild.command?.nameLocalized ?? capitalize(guild.commandName);
    guild = guild.guild;
  }

  const embed = new EmbedBuilder()
    .setAuthor({
      iconURL: guild.iconURL() ?? undefined,
      name: `${title} | ${guild.name}`,
    });

  const options = {
    embed,
    error: (description: string) => {
      embed.setColor(Colors.Red).setDescription(`❌ ${description}`);
      return options;
    },
    gray: (description: string) => {
      embed.setColor(Colors.Grey).setDescription(description);
      return options;
    },
    info: (description: string) => {
      embed.setColor(Colors.Blue).setDescription(description);
      return options;
    },
    success: (description: string) => {
      embed.setColor(Colors.Green).setDescription(`✅ ${description}`);
      return options;
    },
    timestamp: (timestamp?: Date | null | number) => {
      embed.setTimestamp(timestamp);
      return options;
    },
    warn: (description: string) => {
      embed.setColor(Colors.Yellow).setDescription(`⚠️ ${description}`);
      return options;
    },
  };

  return options;
};

export function user(interaction: ChatInputCommandInteraction): EmbedOperation;
export function user(user: GuildMember | User, title: string): EmbedOperation;
export function user(user: ChatInputCommandInteraction | GuildMember | User, title?: string): EmbedOperation {
  if (user instanceof ChatInputCommandInteraction) {
    title = user.command?.nameLocalized ?? capitalize(user.commandName);
    user = user.user;
  }

  const embed = new EmbedBuilder()
    .setAuthor({
      iconURL: user.displayAvatarURL() ?? undefined,
      name: `${title} | ${user.displayName}`,
    });

  const options = {
    embed,
    error: (description: string) => {
      embed.setColor(Colors.Red).setDescription(`❌ ${description}`);
      return options;
    },
    gray: (description: string) => {
      embed.setColor(Colors.Grey).setDescription(description);
      return options;
    },
    info: (description: string) => {
      embed.setColor(Colors.Blue).setDescription(description);
      return options;
    },
    success: (description: string) => {
      embed.setColor(Colors.Green).setDescription(`✅ ${description}`);
      return options;
    },
    timestamp: (timestamp?: Date | null | number) => {
      embed.setTimestamp(timestamp);
      return options;
    },
    warn: (description: string) => {
      embed.setColor(Colors.Yellow).setDescription(`⚠️ ${description}`);
      return options;
    },
  };

  return options;
};
