const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { Pagination } = require("../../handler/pagination");
const speedruns = require("../../models/speedruns");

module.exports = {
    name: "leaderboard",
    description: "displays the speedruns leaderboard",
    options: [
        {
            name: "speedrun",
            type: "STRING",
            required: true,
            description: "The type of speed run of this video",
            choices: global.speedRunChoices,
        },
        {
            name: "mode",
            type: "STRING",
            required: true,
            description: "The mode you played this speedrun",
            choices: global.modeChoices,
        },
    ],
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    run: async (client, interaction) => {
        let descs = [];
        function secondsToString(seconds) {
            var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
            var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
            var numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;
            if (numhours) return numhours + " hours " + numminutes + " minutes " + numseconds + " seconds";
            else return numminutes + " minutes " + numseconds + " seconds";
        }
        const allRuns = await speedruns.find({ mode: interaction.options.getString("mode"), speedRunType: interaction.options.getString("speedrun") });
        const sortedRuns = allRuns.sort((a, b) => a.length - b.length);
        for (let i = 0; i < sortedRuns.length; i++) {
            descs.push(`\`${i + 1}\` **${client.users.cache.get(sortedRuns[i].userId)?.username}**: ${secondsToString(sortedRuns[i].length)}`);
        }
        if (!descs.length)
            return interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setTitle(`${global.modeChoices.find((r) => r.value === interaction.options.getString("mode")).name} ${global.speedRunChoices.find((r) => r.value === interaction.options.getString("speedrun")).name} Speed Run Leaderboard`)
                        .setDescription("There are no submissions yet for this leaderboard"),
                ],
            });

        let embeds = [];
        for (let i = 0; i < descs.length; i += 20) {
            embedDescription = descs.slice(i, i + 20).join("\n");
            embeds.push(
                new MessageEmbed()
                    .setTitle(`${global.modeChoices.find((r) => r.value === interaction.options.getString("mode")).name} ${global.speedRunChoices.find((r) => r.value === interaction.options.getString("speedrun")).name} Speed Run Leaderboard`)
                    .setColor("DARK_RED")
                    .setDescription(embedDescription ? embedDescription : "something wrong")
            );
        }

        await new Pagination(interaction.channel, embeds, "page", 60000, [
            {
                style: "DANGER",
                emoji: "⏮️",
            },
            {
                style: "DANGER",
                emoji: "◀️",
            },
            {
                style: "DANGER",
                emoji: "⏹️",
            },
            {
                style: "DANGER",
                emoji: "▶️",
            },
            {
                style: "DANGER",
                emoji: "⏭️",
            },
        ]).paginate();
        return interaction.deleteReply();
    },
};
