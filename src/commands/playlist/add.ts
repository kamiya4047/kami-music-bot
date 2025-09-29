import { ActionRowBuilder, AutocompleteInteraction, ButtonBuilder, ButtonInteraction, ButtonStyle, Colors, ComponentType, EmbedBuilder, SlashCommandStringOption, SlashCommandSubcommandBuilder } from 'discord.js';
import { eq } from 'drizzle-orm';

import { KamiSubcommand } from '@/core/command';
import { Platform } from '@/core/resource';
import { db } from '@/database';
import { deferEphemeral } from '@/utils/callback';
import { user } from '@/utils/embeds';

import Logger from '@/utils/logger';

import * as schema from '@/database/schema';

import type { ChatInputCommandInteraction } from 'discord.js';
import type { InferSelectModel } from 'drizzle-orm';

import type { KamiResource } from '@/core/resource';

const nameOption = new SlashCommandStringOption()
  .setName('name')
  .setNameLocalization('ja', '名前')
  .setNameLocalization('zh-TW', '名稱')
  .setDescription('Name of the playlist to add to')
  .setDescriptionLocalization('ja', '追加先のプレイリスト名')
  .setDescriptionLocalization('zh-TW', '要加入的播放清單名稱')
  .setRequired(true)
  .setAutocomplete(true);

const addToPlaylist = async (
  interaction: ButtonInteraction<'cached'> | ChatInputCommandInteraction<'cached'>,
  playlist: InferSelectModel<typeof schema.playlist>,
  resource: KamiResource,
) => {
  try {
    await db
      .update(schema.playlist)
      .set({
        resources: [...playlist.resources, `${resource.id}@${resource.type}`],
      })
      .where(eq(schema.playlist.id, playlist.id));

    const embed = new EmbedBuilder()
      .setColor(Colors.Green)
      .setAuthor({
        iconURL: interaction.guild.iconURL() ?? undefined,
        name: `播放清單 | ${interaction.guild.name}`,
      })
      .setDescription(`✅ 已將 "${resource.title}" 加入播放清單 "${playlist.name}"`)
      .setThumbnail(resource.thumbnail)
      .setTimestamp();

    if ('update' in interaction) {
      await interaction.update({
        components: [],
        embeds: [embed],
      });
    }
    else {
      await interaction.editReply({
        embeds: [embed],
      });
    }
  }
  catch (error) {
    Logger.error('addToPlaylist', error);

    const embed = new EmbedBuilder()
      .setColor(Colors.Red)
      .setAuthor({
        iconURL: interaction.guild.iconURL() ?? undefined,
        name: `播放清單 | ${interaction.guild.name}`,
      })
      .setDescription('❌ 加入播放清單失敗，請稍後再試')
      .setTimestamp();

    if ('update' in interaction) {
      await interaction.update({
        components: [],
        embeds: [embed],
      });
    }
    else {
      await interaction.editReply({
        embeds: [embed],
      });
    }
  }
};

export default new KamiSubcommand({
  builder: new SlashCommandSubcommandBuilder()
    .setName('add')
    .setNameLocalization('ja', '追加')
    .setNameLocalization('zh-TW', '加入')
    .setDescription('Add current playing song to a playlist')
    .setDescriptionLocalization('ja', '現在再生中の曲をプレイリストに追加する')
    .setDescriptionLocalization('zh-TW', '將目前播放中的歌曲加入到播放清單')
    .addStringOption(nameOption),
  async execute(interaction) {
    await deferEphemeral(interaction);

    const name = interaction.options.getString('name', true);
    const player = this.players.get(interaction.guildId);

    if (!player?.currentResource) {
      const embed = user(interaction)
        .error('❌ 目前沒有正在播放的歌曲')
        .embed;

      await interaction.editReply({
        embeds: [embed],
      });
      return;
    }

    if (player.currentResource.metadata.type === Platform.File) {
      const embed = user(interaction)
        .error('❌ 無法將自定音檔加入至播放清單')
        .embed;

      await interaction.editReply({
        embeds: [embed],
      });
      return;
    }

    try {
      const targetPlaylist = await db.query.playlist.findFirst({
        where: (playlist, { and }) => and(
          eq(playlist.name, name),
          eq(playlist.ownerId, interaction.user.id),
        ),
      });

      if (!targetPlaylist) {
        const embed = user(interaction)
          .error(`❌ 找不到名為 "${name}" 的播放清單`)
          .embed;

        await interaction.editReply({
          embeds: [embed],
        });
        return;
      }

      const resourceId = `${player.currentResource.metadata.id}@${player.currentResource.metadata.type}`;

      if (!targetPlaylist.resources.includes(resourceId)) {
        await addToPlaylist(
          interaction,
          targetPlaylist,
          player.currentResource.metadata,
        );
      }
      else {
        const row = new ActionRowBuilder<ButtonBuilder>()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('add_anyway')
              .setLabel('仍要加入')
              .setStyle(ButtonStyle.Primary),
          );

        const embed = new EmbedBuilder()
          .setColor(Colors.Yellow)
          .setAuthor({
            iconURL: interaction.guild.iconURL() ?? undefined,
            name: `播放清單 | ${interaction.guild.name}`,
          })
          .setDescription(`⚠️ "${player.currentResource.metadata.title}" 已經在播放清單 "${name}" 中`)
          .setThumbnail(player.currentResource.metadata.thumbnail)
          .setTimestamp();

        const response = await interaction.editReply({
          components: [row],
          embeds: [embed],
        });

        try {
          const confirmation = await response.awaitMessageComponent({
            componentType: ComponentType.Button,
            filter: (i) => i.user.id === interaction.user.id,
            time: 60_000,
          });

          if (confirmation.customId === 'add_anyway') {
            await addToPlaylist(
              confirmation,
              targetPlaylist,
              player.currentResource.metadata,
            );
          }
        }
        catch (error) {
          Logger.error('addToPlaylist', error);

          await interaction.deleteReply();
        }
      }
    }
    catch (error) {
      Logger.error('addToPlaylist', error);

      const embed = user(interaction)
        .error('❌ 加入播放清單失敗，請稍後再試')
        .embed;

      await interaction.editReply({
        embeds: [embed],
      });
    }
  },
  async onAutocomplete(interaction: AutocompleteInteraction<'cached'>) {
    const focusedValue = interaction.options.getFocused().toString();

    const playlists = await db.query.playlist.findMany({
      columns: {
        name: true,
      },
      where: (playlist, { and, like }) => and(
        eq(playlist.ownerId, interaction.user.id),
        like(playlist.name, `%${focusedValue}%`),
      ),
    });

    await interaction.respond(
      playlists
        .map((playlist) => ({
          name: playlist.name,
          value: playlist.name,
        }))
        .slice(0, 25),
    );
  },
});
