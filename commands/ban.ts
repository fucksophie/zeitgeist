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
        
        const user = client.people.find(e =>
            e.id == args[0]
        );

        if(user) {
            client.message("User " + user.name + " banned.")
            client.kickban(args[0], 0)
        } else {
            client.message("Offline user " + args[0] + " banned.")
        }

        dRoom.banned.push(args[0]); 

        localStorage.setItem("room_"+client.wsUrl+client.channel, JSON.stringify(dRoom));
    } else {
        client.message("You do not have permission!");
    }
}