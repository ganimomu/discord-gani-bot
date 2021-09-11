const { SlashCommand } = require('slash-create');

module.exports = class extends SlashCommand {
    constructor(creator) {
        super(creator, {
            name: "pause",
            description: "Pausa la canción actual.",

            guildIDs: process.env.GUILD_ID ? [ process.env.GUILD_ID ] : undefined
        });
    }

    async run (ctx) {

        const { client } = require('..');

        await ctx.defer();

        const queue = client.player.getQueue(ctx.guildID);
        if (!queue || !queue.playing) return void ctx.sendFollowUp({ content: "No se esta reproduciendo nada." });
        const paused = queue.setPaused(true);
        return void ctx.sendFollowUp({ content: paused ? "Reproductor en pausa." : "Hubo un error al pausar la canción!" });
    }
}
