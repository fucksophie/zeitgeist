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
            client.message("You cannot ban the bot!");
            return;
        }
        

        if(user) {
            if(dRoom.ranks.get(args[0]) != "" || JSON.parse(localStorage.getItem(client.wsUrl+user._id)!).rank == "bot-owner") {
                client.message("You cannot ban ranked players!");
                return;
            }
            
            client.message("User " + user.name + " banned.")
            client.kickban(args[0], 1.8e+6)
        } else {
            if(dRoom.ranks.get(args[0]) != "" || JSON.parse(localStorage.getItem(client.wsUrl+args[0])!).rank == "bot-owner") {
                client.message("You cannot ban ranked players!");
                return;
            }

            client.message("Offline user " + args[0] + " banned.")
        }

        dRoom.ranks.set(args[0], "banned"); 

        setDRoom(dRoom, client);
    } else {
        client.message("You do not have permission!");
    }
}