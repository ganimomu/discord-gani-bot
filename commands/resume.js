const { SlashCommand } = require('slash-create');

module.exports = class extends SlashCommand {
    constructor(creator) {
        super(creator, {
            name: "resume",
            description: "Continua con la reproducción",

            guildIDs: process.env.GUILD_ID ? [ process.env.GUILD_ID ] : undefined
        });
    }

    async run (ctx) {

        const { client } = require('..');

        await ctx.defer();

        const queue = client.player.getQueue(ctx.guildID);
        if (!queue || !queue.playing) return void ctx.sendFollowUp({ content: "No hay música en reproducción." });
        const paused = queue.setPaused(false);
        return void ctx.sendFollowUp({ content: !paused ? "Resumido." : "Hubo un error al resumir la canción!" });
    }
}
