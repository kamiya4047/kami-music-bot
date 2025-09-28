import { ButtonInteraction, ChatInputCommandInteraction, MessageContextMenuCommandInteraction, StringSelectMenuInteraction, bold, hyperlink } from 'discord.js';
import { eq } from 'drizzle-orm';

import { db } from '@/database';

import { createErrorEmbed, createPlaylistEmbed } from './embeds';

import Logger from './logger';

import * as schema from '@/database/schema';

import type { InferSelectModel } from 'drizzle-orm';

import type { KamiResource } from '@/core/resource';

export const addToPlaylist = async (
  interaction: ButtonInteraction<'cached'> | ChatInputCommandInteraction<'cached'> | MessageContextMenuCommandInteraction<'cached'> | StringSelectMenuInteraction<'cached'>,
  playlist: InferSelectModel<typeof schema.playlist>,
  resources: KamiResource[],
) => {
  try {
    await db
      .update(schema.playlist)
      .set({
        resources: [
          ...playlist.resources,
          ...resources.map((r) => `${r.id}@${r.type}`),
        ],
      })
      .where(eq(schema.playlist.id, playlist.id));

    const embed = createPlaylistEmbed({
      user: interaction.member,
      description: resources.length === 1
        ? `✅ 已將「${bold(hyperlink(resources[0].title, resources[0].url))}」加入播放清單「${bold(playlist.name)}」`
        : `✅ 已將 ${resources.length} 個資源加入播放清單「${bold(playlist.name)}」`,
      thumbnail: resources[0].thumbnail,
    });

    if ('update' in interaction) {
      await interaction.update({
        embeds: [embed],
        components: [],
      });
    }
    else {
      await interaction.editReply({
        embeds: [embed],
        components: [],
      });
    }
  }
  catch (error) {
    Logger.error('addToPlaylist', error);

    const embed = createErrorEmbed(interaction.member, '未知錯誤');

    if ('update' in interaction) {
      await interaction.update({
        embeds: [embed],
        components: [],
      });
    }
    else {
      await interaction.editReply({
        embeds: [embed],
        components: [],
      });
    }
  }
};
