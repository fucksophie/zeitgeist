import { Client, Player } from "../Client.ts";
import { DatabasePlayer } from "../index.ts";

export default function (player: Player, client: Client)  {
    const dPlayer: DatabasePlayer = JSON.parse(localStorage.getItem(client.wsUrl+player.id)!);

    if(dPlayer.rank == "room-owner" || dPlayer.rank == "bot-owner") {
        if(!client.me.crown) {
            client.message("I do not have the crown.")
            return;
        }

        client.giveCrown(player.id);
    } else {
        client.message("You do not have permission!");
    }
}