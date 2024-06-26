const Discord = require("discord.js");
const { inspect } = require("util");

module.exports = {
    name: "eval",
    aliases: ["e"],
    run: async (client, message, args) => {
        const owners = global.config.owners;
        if (!owners.includes(message.author.id)) return;
        const code = args.join(" ");
        const token = client.token.split("").join("[^]{0,2}");
        const rev = client.token.split("").reverse().join("[^]{0,2}");
        const filter = new RegExp(`${token}|${rev}`, "g");
        try {
            let output = eval(code);
            if (output instanceof Promise || (Boolean(output) && typeof output.then === "function" && typeof output.catch === "function")) output = await output;
            output = inspect(output, { depth: 0, maxArrayLength: null });
            output = output.replace(filter, "no");
            if (output.length < 1950) {
                const outputembed = new Discord.MessageEmbed()
                    .setTitle("Evaluation Successful")
                    .setTimestamp()
                    .setDescription("**Argument**\n```" + code + "```\n\n**Output**\n```" + output + "```")

                    message.channel.send({ embeds: [outputembed] });
            }
        } catch (error) {
            message.channel.send({ content: ` \`\`\`js\n${error}\`\`\` ` });
        }
    },
};
