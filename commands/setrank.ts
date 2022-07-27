import { Client, Player } from "../Client.ts";
import { DatabasePlayer, DatabaseRoom, getDRoom, setDRoom } from "../Database.ts";

export default function (player: Player, client: Client, args: string[])  {
    const dPlayer: DatabasePlayer = JSON.parse(localStorage.getItem(client.wsUrl+player.id)!);
    const dRoom: DatabaseRoom = getDRoom(client)!;
    console.log(dRoom.ranks)
    if(dRoom.ranks.get(player.id) == "room-owner" || dPlayer.rank == "bot-owner") {
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

                if(dRoom.ranks.get(args[0]) == "banned") {
                    client.message("User is banned.")
                    return;
                }

                dRoom.ranks.set(args[0], "room-owner");

                setDRoom(dRoom, client);

                client.message(args[0] + " is now a room owner.");
            } else if(args[1] == "room-operator") {

                if(dRoom.ranks.get(args[0]) == "banned") {
                    client.message("User is banned.")
                    return;
                }

                dRoom.ranks.set(args[0], "room-operator");

                setDRoom(dRoom, client);    
                    
                client.message(args[0] + " is now a room operator.");
            }  else if(args[1] == "none") {
                if(dRoom.ranks.get(player.id) == "room-operator") {
                    client.message("You cannot derank another person.")
                    return;
                }  

                if(dRoom.ranks.get(player.id) == "room-owner") {
                    if(dRoom.ranks.get(args[0]) !== "room-operator") {
                        client.message("You cannot derank this person.")
                    } else {
                        dRoom.ranks.delete(args[0]);
        
                        setDRoom(dRoom, client);    
                            
                        client.message(args[0] + " is now rankless.");
                    }
                }

                if(dPlayer.rank == "bot-owner") {
                    dRoom.ranks.delete(args[0]);
        
                    setDRoom(dRoom, client);    
                        
                    client.message(args[0] + " is now rankless.");
                }
            } else {
                client.message("Available ranks: none (only usable by Bot Owners and by Room Owners (if deranking Operator)), room-operator, room-owner (only usable by Bot Owners)")
            }
        } else {
            client.message("Player does not exist. (in Database)")
        }
    } else {
        client.message("You do not have permission!");
    }
}