const { SlashCommand, CommandOptionType } = require('slash-create');

module.exports = class extends SlashCommand {
    constructor(creator) {
        super(creator, {
            name: "jump",
            description: "Salta a una canción especifica.",
            options: [
                {
                    name: "tracks",
                    description: "La cantidad de canciones a saltar.",
                    type: CommandOptionType.INTEGER,
                    required: true,
                }
            ],
            
            guildIDs: process.env.GUILD_ID ? [ process.env.GUILD_ID ] : undefined
        });
    }

    async run (ctx) {

        const { client } = require('..');

        await ctx.defer();

        const queue = client.player.getQueue(ctx.guildID);
        if (!queue || !queue.playing) return void ctx.sendFollowUp({ content: "No hay canciones reproduciendose!" });
        
        const tracksCount = ctx.options.tracks;
        queue.jump(tracksCount);

        ctx.sendFollowUp({ content: `Saltadas ${tracksCount} canciones.` });
    }
}
