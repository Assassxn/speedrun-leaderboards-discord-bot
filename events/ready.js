const client = require("../index");

client.on("ready", () => {
    console.log(`${client.user.tag} is up and ready to go!`);
    client.user.setPresence({
        status: "idle",
        activities: [
            {
                name: "Developed by Λssassinツ#2020",
                type: "PLAYING",
            },
        ],
    });
});
