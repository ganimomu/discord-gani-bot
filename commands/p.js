require('dotenv').config();
const { SlashCommand, CommandOptionType } = require("slash-create");
const { QueryType, Util } = require("discord-player");
const fs = require("fs");

module.exports = class extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: "p",
      description: "ALIAS DE /play: Reproduce la canción especificada.",
      options: [
        {
          name: "query",
          type: CommandOptionType.STRING,
          description: "La canción que quieras reproducir.",
          required: true,
        },
      ],

      guildIDs: process.env.GUILD_ID ? [process.env.GUILD_ID] : undefined,
    });
  }

  async run(ctx) {
    const { client } = require("..");

    await ctx.defer();

    const guild = client.guilds.cache.get(ctx.guildID);
    const channel = guild.channels.cache.get(ctx.channelID);
    const query = ctx.options.query;
    const searchResult = await client.player
      .search(query, {
        requestedBy: ctx.user,
        searchEngine: QueryType.AUTO,
      })
      .catch(() => {
        console.log("he");
      });
    if (!searchResult || !searchResult.tracks.length)
      return void ctx.sendFollowUp({
        content: "No se encontraron resultados!",
      });

    const queue = await client.player.createQueue(guild, {
      metadata: channel,
      leaveOnEnd: false,
      leaveOnStop: false,
      leaveOnEmpty: true,
      leaveOnEmptyCooldown: 10000,
      ytdlOptions: {
        quality: "highest",
        filter: "audioonly",
        highWaterMark: 1 << 25,
        dlChunkSize: 0,
      },
    });

    const member =
      guild.members.cache.get(ctx.user.id) ??
      (await guild.members.fetch(ctx.user.id));
    try {
      if (!queue.connection) await queue.connect(member.voice.channel);
    } catch {
      void client.player.deleteQueue(ctx.guildID);
      return void ctx.sendFollowUp({
        content: "No se pudo unir el bot al canal!",
      });
    }

    await ctx.sendFollowUp({
      content: `Cargando ${
        searchResult.playlist
          ? "lista de reproducción"
          : "canción: **" + searchResult.tracks[0] + "**"
      }...`,
    });
    searchResult.playlist
      ? queue.addTracks(searchResult.tracks)
      : queue.addTrack(searchResult.tracks[0]);
    if (!queue.playing) await queue.play();
  }
};
