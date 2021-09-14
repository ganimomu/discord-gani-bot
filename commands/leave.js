const { SlashCommand } = require('slash-create');

module.exports = class extends SlashCommand {
    constructor(creator) {
        super(creator, {
            name: "leave",
            description: "Desconecta al bot del canal actual.",

            guildIDs: process.env.GUILD_ID ? [ process.env.GUILD_ID ] : undefined
        });
    }

    async run(ctx) {
        
        const { client } = require('..');

        await ctx.defer();
        const queue = client.player.getQueue(ctx.guildID);
        queue.destroy(true);
        return void ctx.sendFollowUp({ content: "Bot desconectado, canciones eliminadas de la cola." });

    }
}
