import { Client, Player } from "../../classes/Client.ts";

export default function (_: Player, client: Client, args: string[]) { 
    const repeified = args.join(" ").replaceAll("g", "r").replaceAll("l", "p").replaceAll("d", "e");
    if(repeified.includes("rape")) {
        client.message("No.");
        return;
    }
    client.message("Repeified: " + repeified)
}
