import { Client, Player } from "../Client.ts";
import { DatabasePlayer, DatabaseRoom, getDRoom } from "../Database.ts";

export default function (player: Player, client: Client, args: string[])  {
    const dPlayer: DatabasePlayer = JSON.parse(localStorage.getItem(client.wsUrl+player.id)!);
    const dRoom: DatabaseRoom = getDRoom(client)!;

    if(dRoom.ranks.get(player.id) == "room-operator" || dRoom.ranks.get(player.id) == "room-owner" || dPlayer.rank == "bot-owner") {
        if(!args[0]) {
            client.message("Missing argument.")
            return;
        }

        if(dRoom.ranks.get(args[0]) == "banned") {
            client.message("User " + args[0] + " has been unbanned.")
            dRoom.ranks.delete(args[0]);
        } else {
            client.message("User " + args[0] + " is not banned. (If banned via kickban, try rejoining.)")
        }

        client.unban(args[0]);
        localStorage.setItem("room_"+client.wsUrl+client.channel, JSON.stringify(
            {ranks: [...dRoom.ranks]}));
    } else {
        client.message("You do not have permission!");
    }
}