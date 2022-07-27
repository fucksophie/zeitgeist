import { Client, Player } from "../Client.ts";
import { DatabasePlayer } from "../Database.ts";

export default function (player: Player, client: Client, args: string[])  {
    if(args?.[0]) {
        const dPlayer: DatabasePlayer = JSON.parse(localStorage.getItem(client.wsUrl+args[0])!);
        if(dPlayer) {
            client.message(args[0] + "'s rank is: " + dPlayer.rank)
        } else {
            client.message("Player does not exist.")
        }
    } else {
        const dPlayer: DatabasePlayer = JSON.parse(localStorage.getItem(client.wsUrl+player.id)!);

        client.message("Your rank is: " + dPlayer.rank + " PS. you got epicly pranked")
    }
}