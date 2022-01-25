require("dotenv").config();
const path = require("path");
const _sodium = require('libsodium-wrappers');
const { SlashCreator, GatewayServer } = require("slash-create");
const { Client } = require("discord.js");
const { Player, StreamDispatcher } = require("discord-player");
const { OpusEncoder } = require('@discordjs/opus');
const { registerPlayerEvents } = require("./events");
const fs = require("fs");
const { generateDependencyReport } = require('@discordjs/voice');
console.log(generateDependencyReport());

const encoder = new OpusEncoder(48000, 2);

const client = new Client({
  intents: ["GUILD_VOICE_STATES", "GUILD_MESSAGES", "GUILDS"],
  presence: {
    status: "dnd",
    activities: [
      {
        name: "Ojo del Tirano a su servicio",
        type: "STREAMING",
        url: "https://twitch.tv/ganimomu",
      },
    ],
  },
});

client.player = new Player(client);
/* client.player.use("YOUTUBE_DL", require("@discord-player/downloader").Downloader); */
registerPlayerEvents(client.player);

const creator = new SlashCreator({
  applicationID: process.env.CLIENT_ID,
  publicKey: process.env.CLIENT_PUBLIC_KEY,
  token: process.env.BOT_TOKEN,
});

client.on("ready", () => {
  console.log(`Sesión iniciada como: ${client.user.tag}!`);
});

creator
  .withServer(
    new GatewayServer((handler) => client.ws.on("INTERACTION_CREATE", handler))
  )
  .registerCommandsIn(path.join(__dirname, "commands"));

/* if (process.env.GUILD_ID) creator.syncCommandsIn(process.env.GUILD_ID);
else  */
creator.syncGlobalCommands();

client.login(process.env.BOT_TOKEN);

module.exports.client = client;
module.exports.creator = creator;
