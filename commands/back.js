const { SlashCommand } = require('slash-create');

module.exports = class extends SlashCommand {
    constructor(creator) {
        super(creator, {
            name: "back",
            description: "Reproduce la canción anterior",

            guildIDs: process.env.GUILD_ID ? [ process.env.GUILD_ID ] : undefined
        });
    }

    async run (ctx) {

        const { client } = require('..');

        await ctx.defer();

        const queue = client.player.getQueue(ctx.guildID);
        if (!queue || !queue.playing) return void ctx.sendFollowUp({ content: "No se esta reproduciendo música!" });
        
        await queue.back();

        ctx.sendFollowUp({ content: "Reproduciendo la canción anterior!" });
    }
}
