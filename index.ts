import { Client, Multiclient, Player } from "./Client.ts";
import config from "./config.json" assert { type: "json" }
import { getDRoom, setDRoom } from "./Database.ts";

for(let i = 0; i < localStorage.length; i++) { // clear all timeouts so no issues
    const player = JSON.parse(localStorage.getItem(localStorage.key(i)!)!);
    if(typeof player.money == "number") {
        player.timeouts = []
        localStorage.setItem(player.id, JSON.stringify(player));
    }
}

// deno-lint-ignore no-explicit-any
const commands = new Map<string, any>();

for await (const dirEntry of Deno.readDir("commands")) {
    commands.set(dirEntry.name.split(".")[0],
     (await import("./commands/" + dirEntry.name)).default
    )
}


const mClient = (client: Client) => {
    client.on("connect", () => {
        client.userset("Zeit[g]eist", "#F8F8FF");
        if(!getDRoom(client)) {
            setDRoom({ranks: new Map()}, client);
        }
    })
    client.on("join", (player) => {
        if(client.me.crown) {
            const dRoom = getDRoom(client)!;

            if(dRoom.ranks.get(player._id) == "banned") {
                client.kickban(player._id, 1.8e+6)
            }
        }
    })

    client.on("message", (player: Player, message: string) => {
        if(!localStorage.getItem(client.wsUrl+player.id)) {
            localStorage.setItem(client.wsUrl+player.id, JSON.stringify({id: client.wsUrl+player.id, money: 0, rank: "", items: [], timeouts: []}))
        }

        const args = message.split(" ")
        const command = args.shift();

        if(command?.startsWith("g")) {
            const cc = commands.get(command.substring(1))
            if(cc) cc(player, client, args, commands)
        }
    })
}

config.servers.forEach(server => {
    new Multiclient(mClient).connect(server.url, server.token, server.rooms);
})
