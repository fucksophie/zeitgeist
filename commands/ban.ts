import { Client, Player } from "../Client.ts";
import { DatabasePlayer, DatabaseRoom } from "../index.ts";

export default function (player: Player, client: Client)  {
    const dPlayer: DatabasePlayer = JSON.parse(localStorage.getItem(client.wsUrl+player.id)!);
    const dRoom: DatabaseRoom = JSON.parse(localStorage.getItem("room_"+client.wsUrl+client.channel)!)

    if(dRoom.operators.includes(client.wsUrl+player.id) 
    || dPlayer.rank == "room-owner" || dPlayer.rank == "bot-owner") {
        client.message("(not done yet) rank: " + dPlayer.rank)
    } else {
        client.message("You do not have permission!");
    }
}