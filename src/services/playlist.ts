import { ButtonInteraction, Colors, ComponentType, InteractionResponse, Message, MessageContextMenuCommandInteraction, StringSelectMenuInteraction, bold, hyperlink } from 'discord.js';
import { eq } from 'drizzle-orm';

import { createConfirmationButtons, createPlaylistSelector } from '@/utils/components';
import { KamiResource } from '@/core/resource';
import { addToPlaylist } from '@/utils/playlist';
import { createPlaylistEmbed } from '@/utils/embeds';
import { db } from '@/database';
import { noop } from '@/utils/callback';
import { playlist } from '@/database/schema';

import Logger from '@/utils/logger';

import type { InferSelectModel } from 'drizzle-orm';

type Playlist = InferSelectModel<typeof playlist>;
type PlaylistInteraction = ButtonInteraction<'cached'> | MessageContextMenuCommandInteraction<'cached'> | StringSelectMenuInteraction<'cached'>;

export class PlaylistService {
  async getUserPlaylists(userId: string): Promise<Playlist[]> {
    return db.query.playlist.findMany({
      where: eq(playlist.ownerId, userId),
    });
  }

  async handleMultiplePlaylists(
    interaction: PlaylistInteraction,
    playlists: Playlist[],
    resources: KamiResource | KamiResource[],
  ): Promise<void> {
    const resourceArray = Array.isArray(resources) ? resources : [resources];
    const row = createPlaylistSelector(playlists);
    const embed = createPlaylistEmbed({
      description: resourceArray.length === 1
        ? `請選擇要將「${hyperlink(resourceArray[0].title, resourceArray[0].url)}」加入哪個播放清單`
        : `請選擇要將 ${resourceArray.length} 個資源加入哪個播放清單`,
      thumbnail: resourceArray.length === 1 ? resourceArray[0].thumbnail : undefined,
      user: interaction.member,
    });

    const response = await interaction.editReply({
      components: [row],
      embeds: [embed],
    });

    try {
      const selectedPlaylist = await this.handlePlaylistSelection(response, interaction, playlists);
      if (!selectedPlaylist) return;

      await this.handleSinglePlaylist(interaction, selectedPlaylist, resources);
    }
    catch (error) {
      Logger.error('handleMultiplePlaylists', error);
      await interaction.deleteReply().catch(noop);
    }
  }

  async handleSinglePlaylist(
    interaction: PlaylistInteraction,
    playlist: Playlist,
    resources: KamiResource | KamiResource[],
  ): Promise<void> {
    const resourceArray = Array.isArray(resources) ? resources : [resources];
    const newResources: KamiResource[] = [];
    const duplicateResources: KamiResource[] = [];

    for (const resource of resourceArray) {
      const resourceId = `${resource.id}@${resource.type}`;
      if (!playlist.resources.includes(resourceId)) {
        newResources.push(resource);
      }
      else {
        duplicateResources.push(resource);
      }
    }

    if (duplicateResources.length === 0) {
      await addToPlaylist(interaction, playlist, resourceArray);
      return;
    }

    const row = createConfirmationButtons();
    const embed = createPlaylistEmbed({
      color: Colors.Yellow,
      description: duplicateResources.length === 1
        ? `⚠️ 「${bold(hyperlink(duplicateResources[0].title, duplicateResources[0].url))}」已經在播放清單「${bold(playlist.name)}」中`
        : `⚠️ ${duplicateResources.length} 個資源已經在播放清單「${bold(playlist.name)}」中\n${duplicateResources.map((r) => `• ${r.title}`).join('\n')}`,
      thumbnail: duplicateResources.length === 1 ? duplicateResources[0].thumbnail : undefined,
      user: interaction.member,
    });

    const response = await (interaction instanceof MessageContextMenuCommandInteraction
      ? interaction.editReply({ components: [row], embeds: [embed] })
      : interaction.update({ components: [row], embeds: [embed] }));

    try {
      const confirmation = await this.awaitConfirmation(response, interaction);
      if (confirmation.customId === 'add_anyway') {
        await addToPlaylist(interaction, playlist, resourceArray);
      }
      else {
        await interaction.deleteReply();
      }
    }
    catch (error) {
      Logger.error('handleSinglePlaylist', error);
      await interaction.deleteReply();
    }
  }

  private async awaitConfirmation(
    response: InteractionResponse<true> | Message<true>,
    interaction: PlaylistInteraction,
  ): Promise<ButtonInteraction<'cached'>> {
    const component = await response.awaitMessageComponent({
      componentType: ComponentType.Button,
      filter: (i) => i.user.id === interaction.user.id,
      time: 60_000,
    });

    return component;
  }

  private async handlePlaylistSelection(
    response: Message<true>,
    interaction: PlaylistInteraction,
    playlists: Playlist[],
  ): Promise<Playlist | undefined> {
    const select = await response.awaitMessageComponent({
      componentType: ComponentType.StringSelect,
      filter: (i) => i.user.id === interaction.user.id,
      time: 60_000,
    });

    return playlists.find((p) => p.id === select.values[0]);
  }
}
