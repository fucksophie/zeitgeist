import { Client, Player } from "../Client.ts";
let currentlyFollowing = "";
let firstRun = false;

export default function (player: Player, client: Client, args: string[])  {
    if(currentlyFollowing == "" && !firstRun) {
        firstRun = true;

        client.on("mouse", (x: number, y: number, id: string) => {
            if(id == currentlyFollowing) {
                client.move(x, y);
            }
        })
    }   

    if(args?.[0]) {
        const f = client.findUser(args[0]);

        if(f) {
            client.message("Okay, now following " + f.name + ".");
            currentlyFollowing = f.id;
        } else {
            client.message("Couldn't find user.")
        }
    } else {
        client.message("Okay, following you.");
        currentlyFollowing = player.id;
    }
}