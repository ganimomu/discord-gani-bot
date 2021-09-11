module.exports.registerPlayerEvents = (player) => {

    player.on("error", (queue, error) => {
        console.log(`[${queue.guild.name}] Error en la cola: ${error.message}`);
    });
    player.on("connectionError", (queue, error) => {
        console.log(`[${queue.guild.name}] Error al conectar: ${error.message}`);
    });

    player.on("trackStart", (queue, track) => {
        queue.metadata.send(`Ahora reproduciendo: **${track.title}** en **${queue.connection.channel.name}**!`);
    });

    player.on("trackAdd", (queue, track) => {
        queue.metadata.send(`**${track.title}** fue agregada a la cola!`);
    });

    player.on("botDisconnect", (queue) => {
        queue.metadata.send("Desconectado manualmente del canal. Borrando canciones restantes.");
    });

    player.on("channelEmpty", (queue) => {
        queue.metadata.send("Canal abandonado por inactividad.");
    });

    player.on("queueEnd", (queue) => {
        queue.metadata.send("Se acabaron las canciones!");
    });

};