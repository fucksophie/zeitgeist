import { Client, Player } from "../Client.ts";
import { DatabasePlayer, DatabaseRoom } from "../index.ts";

export default function (player: Player, client: Client, args: string[])  {
    const dPlayer: DatabasePlayer = JSON.parse(localStorage.getItem(client.wsUrl+player.id)!);
    const dRoom: DatabaseRoom = JSON.parse(localStorage.getItem("room_"+client.wsUrl+client.channel)!)

    if(dRoom.operators.includes(player.id) || dRoom.owners.includes(player.id) || dPlayer.rank == "bot-owner") {
        if(!args[0]) {
            client.message("Missing argument.")
            return;
        }

        if(dRoom.banned.includes(args[0])) {
            client.message("User " + args[0] + " has been unbanned.")
            dRoom.banned = dRoom.banned.filter(e => e != args[0]);
        } else {
            client.message("User " + args[0] + " is not banned.")
        }

        localStorage.setItem("room_"+client.wsUrl+client.channel, JSON.stringify(dRoom));
    } else {
        client.message("You do not have permission!");
    }
}