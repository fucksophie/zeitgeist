import { Client, Player } from "../../classes/Client.ts";

export default function (_: Player, client: Client, args: string[]) { 
    const repeified = args.join(" ").replaceAll("g", "r").replaceAll("l", "p").replaceAll("d", "e");
    
    if(repeified.split(" ").join("").toLowerCase().includes("rape")) {
        client.message("No. (1)");
        return;
    }
    
    if(!/^[a-zA-z0-9 ]*$/gm.test(repeified.split(" ").join("").toLowerCase())) {
        client.message("No. (2)")
        return;
    }

    client.message("Repeified: " + repeified)
}
