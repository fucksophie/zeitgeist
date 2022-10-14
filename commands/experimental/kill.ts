import { Client, Player } from "../../classes/Client.ts";
import { Death } from "../../classes/Data.ts";

export default function (player: Player, client: Client, args: string[]) {
    if (!args[0]) {
        client.message("Missing argument.");
        return;
    }

    const user = client.findUser(args[0])

    if(!user) {
        client.message("User could not be found. Use username or ID!");
        return;
    }
    if(user.id == client.me.id) {
        client.message("The Bot is Immortal.");
        return;
    }
    if(user.id == player.id) {
        client.message("Are you seriously trying to kill yourself?");
        return;
    }
    client.message(Death[Math.floor(Death.length * Math.random())].replaceAll("[]", "\""+user.name+"\"").replaceAll("()", "\""+player.name+"\""));
}
