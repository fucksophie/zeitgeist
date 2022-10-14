import { Client, Player } from "../../classes/Client.ts";
import { EightBall } from "../../classes/Data.ts";

const previousAnswers: Map<string, string> = new Map<string, string>();

export default function (_: Player, client: Client, args: string[]) {
    if (!args[0]) {
        client.message("Missing argument.");
        return;
    }

    if(!previousAnswers.get(args.join(" "))) {
        previousAnswers.set(args.join(" "), EightBall[Math.floor(EightBall.length* Math.random())]);
    }

    client.message(previousAnswers.get(args.join(" "))!);
}
