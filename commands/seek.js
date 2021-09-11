const { SlashCommand, CommandOptionType } = require('slash-create');

module.exports = class extends SlashCommand {
    constructor(creator) {
        super(creator, {
            name: "seek",
            description: "Adelanta la canción hasta cierto punto.",
            options: [
                {
                    name: "time",
                    description: "El tiempo a avanzar (en segundos)",
                    type: CommandOptionType.INTEGER,
                    required: true
                }
            ],

            guildIDs: process.env.GUILD_ID ? [ process.env.GUILD_ID ] : undefined
        });
    }

    async run (ctx) {

        const { client } = require('..');

        await ctx.defer();

        const queue = client.player.getQueue(ctx.guildID);
        if (!queue || !queue.playing) return void ctx.sendFollowUp({ content: "No hay música en reproducción." });
        
        const time = ctx.options.time * 1000;
        await queue.seek(time);

        ctx.sendFollowUp({ content: `Canción establecida a ${time / 1000} segundos` });
    }
}
