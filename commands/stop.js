const { SlashCommand } = require('slash-create');

module.exports = class extends SlashCommand {
    constructor(creator) {
        super(creator, {
            name: "stop",
            description: "Detiene el reproductor.",

            guildIDs: process.env.GUILD_ID ? [ process.env.GUILD_ID ] : undefined
        });
    }

    async run(ctx) {
        
        const { client } = require('..');

        await ctx.defer();
        const queue = client.player.getQueue(ctx.guildID);
        if (!queue || !queue.playing) return void ctx.sendFollowUp({ content: "No hay música en reproducción." });
        queue.destroy();
        return void ctx.sendFollowUp({ content: "Reproducción detenida! Canciones restantes eliminadas." });

    }
}
