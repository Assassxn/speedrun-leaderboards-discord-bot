const client = require("../index");
const { Modal, MessageActionRow, TextInputComponent, MessageEmbed } = require("discord.js");
const speedRunSchema = require("../models/speedruns");

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton()) return;
    const [decision, userId, speedrun, mode] = interaction.customId.split("-");

    switch (decision) {
        case "approve":
            {
                await interaction.showModal(
                    new Modal({
                        customId: `res-${interaction.message.id}`,
                        title: "Approval",
                        components: [
                            new MessageActionRow({
                                components: [
                                    new TextInputComponent({ customId: `duration-${interaction.user.id}`, label: "Duration in this format mm:ss", maxLength: 6, minLength: 5, placeholder: "Enter Run length", style: "SHORT", required: true }),
                                ],
                            }),
                        ],
                    })
                );

                const modal = await interaction.awaitModalSubmit({
                    filter: (i) => i.user.id === interaction.user.id,
                    time: 360000,
                });

                await modal.deferReply({ ephemeral: true });
                const duration = modal.fields.getTextInputValue(`duration-${interaction.user.id}`);
                const [mm, ss] = duration.split(":");
                let totalSeconds = parseInt(mm) * 60 + parseInt(ss);
                await speedRunSchema.create({
                    userId,
                    mode,
                    speedRunType: speedrun,
                    length: totalSeconds,
                    submittedAt: Math.floor(Date.now() / 1000),
                    videoLink: interaction.message.content,
                });
                modal.editReply({ embeds: [new MessageEmbed({ color: "GREEN", description: "Speedrun approved successfully ✅" })] });
                interaction.message.edit({ components: [] });

                const user = await client.users.fetch(userId);
                user.send({ embeds: [new MessageEmbed({ color: "GREEN", description: `Your run <${interaction.message.content}> has been approved ✅` })] });
            }
            break;
        case "deny":
            {
                await interaction.showModal(
                    new Modal({
                        customId: `res-${interaction.message.id}`,
                        title: "Denial",
                        components: [
                            new MessageActionRow({
                                components: [new TextInputComponent({ customId: `reason-${interaction.user.id}`, label: "Denial Reason", placeholder: "Enter Denial Reason", style: "PARAGRAPH", required: true })],
                            }),
                        ],
                    })
                );

                const modal = await interaction.awaitModalSubmit({
                    filter: (i) => i.user.id === interaction.user.id,
                    time: 360000,
                });

                await modal.deferReply({ ephemeral: true });
                const reason = modal.fields.getTextInputValue(`reason-${interaction.user.id}`);
                modal.editReply({ embeds: [new MessageEmbed({ color: "RED", description: "Speedrun denied successfully ✅" })] });
                interaction.message.edit({ components: [] });

                const user = await client.users.fetch(userId);
                user.send({ embeds: [new MessageEmbed({ color: "RED", description: `Your run <${interaction.message.content}> has been denied ❌\n\n**Reason:**\n\`\`\`\n${reason}\n\`\`\`` })] });
            }
            break;
    }
});
