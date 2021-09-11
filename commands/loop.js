const { SlashCommand, CommandOptionType } = require('slash-create');
const { QueueRepeatMode } = require('discord-player');

module.exports = class extends SlashCommand {
    constructor(creator) {
        super(creator, {
            name: "loop",
            description: "Establece el modo de bucle de la cola",
            options: [
                {
                    name: "mode",
                    type: CommandOptionType.INTEGER,
                    description: "Loop type",
                    required: true,
                    choices: [
                        {
                            name: "Off",
                            value: QueueRepeatMode.OFF
                        },
                        {
                            name: "Uno",
                            value: QueueRepeatMode.TRACK
                        },
                        {
                            name: "Queue",
                            value: QueueRepeatMode.QUEUE
                        },
                        {
                            name: "Autoplay",
                            value: QueueRepeatMode.AUTOPLAY
                        }
                    ]
                }
            ],

            guildIDs: process.env.GUILD_ID ? [ process.env.GUILD_ID ] : undefined
        });
    }

    async run (ctx) {

        const { client } = require('..');

        await ctx.defer();
        const queue = client.player.getQueue(ctx.guildID);
        if (!queue || !queue.playing) return void ctx.sendFollowUp({ content: "❌ | No music is being played!" });
        const loopMode = ctx.options.mode;
        const success = queue.setRepeatMode(loopMode);
        const mode = loopMode === QueueRepeatMode.TRACK ? "🔂" : loopMode === QueueRepeatMode.QUEUE ? "🔁" : "▶";
        return void ctx.sendFollowUp({ content: success ? `${mode} - Actualizado el bucle de la lista` : "Error al actualizar el modo!" });
    }
}
