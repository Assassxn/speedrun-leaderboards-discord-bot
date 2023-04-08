const { Client, Collection, WebhookClient } = require("discord.js");
require("dotenv").config();

const client = new Client({ intents: 32767 });
module.exports = client;

// Global Variables
client.commands = new Collection();
client.slashCommands = new Collection();


// Initializing the project
require("./handler")(client);
client.login(process.env.TOKEN);
const webhook = new WebhookClient({ url: process.env.WEBHOOK })

global.speedRunChoices = [
    {
        name: "Mythic Storm King",
        value: "msk",
    },
    {
        name: "Canny Storm King",
        value: "csk",
    },
    {
        name: "Rescue the Survivors",
        value: "rts",
    },
    {
        name: "Destroy the Encampments",
        value: "dte",
    },
    {
        name: "Hit the Road",
        value: "htr",
    },
    {
        name: "Frostnite",
        value: "frostnite",
    },
    {
        name: "Dungeons",
        value: "dungeons",
    },
];
global.modeChoices = [
    {
        name: "Solo",
        value: "solo",
    },
    {
        name: "Duos",
        value: "duos",
    },
    {
        name: "Trios",
        value: "trios",
    },
    {
        name: "Squad",
        value: "squad",
    },
];

process.on("unhandledRejection", (reason, p) => {
    console.log(" [antiCrash] :: Unhandled Rejection/Catch");
    console.log(reason, p);
    webhook.send({ content: `${reason}` });
});
process.on("uncaughtException", (err, origin) => {
    console.log(" [antiCrash] :: Uncaught Exception/Catch");
    console.log(err, origin);
    webhook.send({ content: `${err}` });
});
process.on("uncaughtExceptionMonitor", (err, origin) => {
    console.log(" [antiCrash] :: Uncaught Exception/Catch (MONITOR)");
    console.log(err, origin);
    webhook.send({ content: `${err}` });
});
process.on("multipleResolves", (type, promise, reason) => {
    console.log(" [antiCrash] :: Multiple Resolves");
    console.log(type, promise, reason);
    webhook.send({ content: `${reason}` });
});
