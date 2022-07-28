import { Client, Player } from "../../classes/Client.ts";
import { DatabasePlayer, DatabaseRoom, getDRoom } from "../../classes/Database.ts";

export default function (player: Player, client: Client, args: string[])  {
    const dRoom: DatabaseRoom = getDRoom(client)!;

    if(args?.[0]) {
        const dPlayer: DatabasePlayer = JSON.parse(localStorage.getItem(client.wsUrl+args[0])!);

        if(dPlayer) {
            client.message(args[0] + "'s rank is: " + (dPlayer.rank ||"(none)")+ ". Room rank: " + (dRoom.ranks.get(args[0]) || "(none)"))
        } else {
            client.message("Player does not exist.")
        }
    } else {
        const dPlayer: DatabasePlayer = JSON.parse(localStorage.getItem(client.wsUrl+player.id)!);

        client.message(player.name + "'s rank is: " + (dPlayer.rank ||"(none)")+ ". Room rank: " + (dRoom.ranks.get(player.id) || "(none)"))
    }
}