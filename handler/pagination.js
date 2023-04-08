"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pagination = void 0;
const discord_js_1 = require("discord.js");
const availableEmojis = ["⏮️", "◀️", "⏹️", "▶️", "⏭️"];
class Pagination {
    /**
     *
     * @param {TextChannel | DMChannel} channel - The target channel
     * @param {MessageEmbed[]} pages - Embed pages
     * @param {string} [footerText] - Optional footer text, will show `Text 1 of 5` if you pass `Text`, for example
     * @param {number} timeout - How long button need to be active
     * @param {ButtonOption[]} options - optional options for the buttons
     */
    constructor(channel, pages, footerText = "Page", timeout, options) {
        this.footerText = footerText;
        this.timeout = timeout;
        this.options = options;
        this.index = 0;
        if (options && options.length > 5) {
            throw new TypeError("You have passed more than 5 buttons as options");
        }
        else if (options && options.length < 4) {
            throw new TypeError("You have passed less than 5 buttons as options");
        }
        this.channel = channel;
        this.pages = pages.map((page, pageIndex) => {
            if (page.footer && (page.footer.text || page.footer.iconURL))
                return page;
            return page.setFooter({
                text: `${footerText} ${pageIndex + 1} of ${pages.length}`
            });
        });
    }
    /**
     * Starts the pagination
     */
    async paginate() {
        var _a;
        this.message = await this.channel.send({
            embeds: [this.pages[this.index]],
            components: [
                {
                    type: 1,
                    components: this.options ? this.options.map((x, i) => {
                        return new discord_js_1.MessageButton({
                            emoji: x.emoji,
                            style: x.style,
                            type: 2,
                            label: x.label,
                            customId: availableEmojis[i]
                        });
                    }) : [
                        {
                            type: 2,
                            style: "PRIMARY",
                            label: "First",
                            emoji: "⏮️",
                            customId: "⏮️"
                        }, {
                            type: 2,
                            style: "PRIMARY",
                            label: "Prev",
                            emoji: "◀️",
                            customId: "◀️"
                        }, {
                            type: 2,
                            style: "DANGER",
                            label: "Stop",
                            emoji: "⏹️",
                            customId: "⏹️"
                        }, {
                            type: 2,
                            style: "PRIMARY",
                            label: "Next",
                            emoji: "▶️",
                            customId: "▶️"
                        }, {
                            type: 2,
                            style: "PRIMARY",
                            label: "Last",
                            emoji: "⏭️",
                            customId: "⏭️"
                        },
                    ]
                },
            ],
        });
        if (this.pages.length < 2) {
            return;
        }
        const interactionCollector = (_a = this.message) === null || _a === void 0 ? void 0 : _a.createMessageComponentCollector({
            max: this.pages.length * 5,
        });
        setTimeout(async () => {
            var _a;
            interactionCollector === null || interactionCollector === void 0 ? void 0 : interactionCollector.stop("Timeout");
            await ((_a = this === null || this === void 0 ? void 0 : this.message) === null || _a === void 0 ? void 0 : _a.edit({
                components: [],
            }));
        }, this.timeout ? this.timeout : 60000);
        interactionCollector.on("collect", async (interaction) => {
            const { customId } = interaction;
            let newIndex = customId === availableEmojis[0]
                ? 0 // Start
                : customId === availableEmojis[1]
                    ? this.index - 1 // Prev
                    : customId === availableEmojis[2]
                        ? NaN // Stop
                        : customId === availableEmojis[3]
                            ? this.index + 1 // Next
                            : customId === availableEmojis[4]
                                ? this.pages.length - 1 // End
                                : this.index;
            if (isNaN(newIndex)) {
                // Stop
                interactionCollector.stop("stopped by user");
                await this.message.edit({
                    components: [],
                });
            }
            else {
                if (newIndex < 0)
                    newIndex = 0;
                if (newIndex >= this.pages.length)
                    newIndex = this.pages.length - 1;
                this.index = newIndex;
                await this.message.edit({
                    embeds: [this.pages[this.index]],
                });
            }
        });
        interactionCollector.on("end", async () => {
            var _a;
            await ((_a = this === null || this === void 0 ? void 0 : this.message) === null || _a === void 0 ? void 0 : _a.edit({
                components: [],
            }));
        });
    }
}
exports.Pagination = Pagination;