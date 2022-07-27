import { Client, Player } from "../Client.ts";
import { DatabasePlayer, DatabaseRoom } from "../index.ts";

export default function (player: Player, client: Client, args: string[])  {
    const dPlayer: DatabasePlayer = JSON.parse(localStorage.getItem(client.wsUrl+player.id)!);
    const dRoom: DatabaseRoom = JSON.parse(localStorage.getItem("room_"+client.wsUrl+client.channel)!)

    if(dRoom.owners.includes(player.id) || dPlayer.rank == "bot-owner") {
        if(args.length < 2) {
            client.message("Missing arguments (2).")
            return;
        }
        
        const rawPlayer: DatabasePlayer = JSON.parse(localStorage.getItem(client.wsUrl+args[0])!);

        if(rawPlayer) {
            if(args[1] == "room-owner") {
                if(dPlayer.rank !== "bot-owner") {
                    client.message("Only bot owners may make other people room owners.")
                    return;
                } 

                dRoom.owners.push(args[0]);

                localStorage.setItem("room_"+client.wsUrl+client.channel, JSON.stringify(dRoom));

                client.message(args[0] + " is now a room owner.");
            } else if(args[1] == "room-operator") {
                dRoom.operators.push(args[0]);

                localStorage.setItem("room_"+client.wsUrl+client.channel, JSON.stringify(dRoom));

                client.message(args[0] + " is now a room operator.");
            } else {
                client.message("Available ranks: room-operator, room-owner (only usable by Bot Owners)")
            }
        } else {
            client.message("Player does not exist. (in Database)")
        }
    } else {
        client.message("You do not have permission!");
    }
}