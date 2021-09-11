require("dotenv").config();
const path = require("path");
const { SlashCreator, GatewayServer } = require("slash-create");
const { Client } = require("discord.js");
const { Player } = require("discord-player");
const { registerPlayerEvents } = require("./events");
const { generateDocs } = require("./docs");

const client = new Client({
  intents: ["GUILD_VOICE_STATES", "GUILD_MESSAGES", "GUILDS"],
  presence: {
    status: "dnd",
    activities: [
      {
        name: "@ Ganimomu :)",
        type: "STREAMING",
        url: "https://twitch.tv/ganimomu",
      },
    ],
  },
});

client.player = new Player(client);
registerPlayerEvents(client.player);

const creator = new SlashCreator({
  applicationID: process.env.CLIENT_ID,
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

if (process.env.GUILD_ID)
  creator.syncCommandsIn(process.env.GUILD_ID);
else creator.syncCommands();

client.login(process.env.BOT_TOKEN);

module.exports.client = client;
module.exports.creator = creator;
