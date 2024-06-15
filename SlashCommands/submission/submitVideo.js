const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    name: "submit",
    description: "Submit a video to get a role",
    options: [
        {
            name: "link",
            type: "STRING",
            required: true,
            description: "This video link to your speedrun",
        },
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
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        interaction.followUp({ embeds: [new MessageEmbed({ color: "DARK_RED", description: "Your run has been submitted successfully ✅\n You will receive a private message with the decision of approval/denial." })] });
        client.channels.cache.get(global.config.channels.submits).send({
            content: interaction.options.getString("link"),
            embeds: [
                new MessageEmbed({
                    color: "DARK_RED",
                    author: { name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) },
                    fields: [
                        {
                            name: "Submitted At:",
                            value: `<t:${Math.floor(Date.now() / 1000)}:f>`,
                            inline: true,
                        },
                        {
                            name: "Submitted By:",
                            value: `<@${interaction.user.id}>`,
                            inline: true,
                        },
                        {
                            name: "Speedrun:",
                            value: `${global.speedRunChoices.find((c) => c.value === interaction.options.getString("speedrun")).name}`,
                            inline: true,
                        },
                        {
                            name: "Mode:",
                            value: `${global.modeChoices.find((c) => c.value === interaction.options.getString("mode")).name}`,
                            inline: true,
                        },
                    ],
                }),
            ],
            components: [
                new MessageActionRow({
                    components: [
                        new MessageButton({
                            customId: `approve-${interaction.user.id}-${interaction.options.getString("speedrun")}-${interaction.options.getString("mode")}`,
                            label: "Approve",
                            style: "SUCCESS",
                        }),
                        new MessageButton({
                            customId: `deny-${interaction.user.id}-${interaction.options.getString("speedrun")}-${interaction.options.getString("mode")}`,
                            label: "Deny",
                            style: "DANGER",
                        }),
                    ],
                }),
            ],
        });
    },
};
