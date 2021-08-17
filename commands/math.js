import Leaderboard from "../libraries/leaderboard.js";
import { wait } from "../libraries/util.js";

export const name = "math";
export const description = "Be the first to solve simple math additions.";
export const leaderboard = new Leaderboard(name, false);

export async function execute (interaction) {

    await interaction.reply("Get ready...");
    await wait(2.5);

    const A = Math.floor(Math.random() * 90) + 10;
    const B = Math.floor(Math.random() * 90) + 10;
    const ANSWER = A + B;
    await interaction.editReply(`What's **${A} + ${B}** ?`);
    const start = Date.now();

    const onAnswer = a => {
        if (a.channel != interaction.channel || a.author.bot) return;
        if (a.content == ANSWER) {
            const time = (Date.now() - start) / 1000;
            interaction.followUp(`${a.member.displayName} won in \`${time.toFixed(3)}\` seconds!`);
            interaction.client.removeListener("messageCreate", onAnswer);
            clearTimeout(timeout);
            leaderboard.add(a.member, { value: time.toFixed(3), unit: "s" });
        }
    };

    const timeout = setTimeout(() => {
        interaction.followUp(`It's been 20 seconds! The answer was **${ANSWER}**.`);
        interaction.client.removeListener("messageCreate", onAnswer);
    }, 20000);

    interaction.client.on("messageCreate", onAnswer);
};