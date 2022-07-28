import { Client, Player } from "../../classes/Client.ts";
import { DatabasePlayer } from "../../classes/Database.ts";

export default function (player: Player, client: Client, args: string[])  {
    const dPlayer: DatabasePlayer = JSON.parse(localStorage.getItem(client.wsUrl+player.id)!);

    if(dPlayer.rank == "bot-owner") {
        try {
            const output = eval(args.join(" "))
            client.message("Output: " + output)
        } catch(e) {
            client.message("Error: " + e)
        }
    } else {
        
        client.message("You are not the owner of this bot.")
    }
}