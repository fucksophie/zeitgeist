import { Client, Player } from "../Client.ts";
import { DatabasePlayer, DatabaseRoom, getDRoom, setDRoom } from "../Database.ts";

export default function (player: Player, client: Client, args: string[])  {
    const dPlayer: DatabasePlayer = JSON.parse(localStorage.getItem(client.wsUrl+player.id)!);
    const dRoom: DatabaseRoom = getDRoom(client)!;

    if(dRoom.ranks.get(player.id) == "room-operator" || dRoom.ranks.get(player.id) == "room-owner" || dPlayer.rank == "bot-owner") {
        if(!args[0]) {
            client.message("Missing argument.")
            return;
        }
        
        const user = client.people.find(e =>
            e.id == args[0]
        );

        if(args[0] == client.me._id) {
            client.message("You cannot kickban the bot!");
            return;
        }
        
        if(user) {
            client.message("User " + user.name + " banned.")
            client.kickban(args[0], 1.8e+6)
        } else {
            client.message("Offline user " + args[0] + " banned.")
        }

        dRoom.ranks.set(args[0], "banned"); 

        setDRoom(dRoom, client);
    } else {
        client.message("You do not have permission!");
    }
}