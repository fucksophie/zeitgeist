import { Client, Multiclient, Player } from "./Client.ts";
import config from "./config.json" assert { type: "json" }

for(let i = 0; i < localStorage.length; i++) { // clear all timeouts so no issues
    const player = JSON.parse(localStorage.getItem(localStorage.key(i)!)!);
    player.timeouts = []
    localStorage.setItem(player.id, JSON.stringify(player));
}

export interface DatabasePlayer {
    id: string
    money: number
    timeouts: string[]
    rank: string
    items: {name: string, cost: number, amount: number, garbage: boolean}[]
}

export interface DatabaseRoom {
    operators: string[],
    owners: string[],
    banned: string[],
    name: string,
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
        client.userset("[p] AppleBot 🍎", "#ff0000");

        if(!localStorage.getItem("room_"+client.wsUrl+client.channel)) {
            localStorage.setItem("room_"+client.wsUrl+client.channel, JSON.stringify({name: client.channel, banned: [], operators: []}))
        } else { // TODO: backwards compatabillity removal
            const response: DatabaseRoom = JSON.parse(localStorage.getItem("room_"+client.wsUrl+client.channel)!);
            if(!response.owners) {
                console.log("backcompat: " + client.channel)

                response.owners = []
            }
            localStorage.setItem("room_"+client.wsUrl+client.channel, JSON.stringify(response))
        }
    })

    client.on("join", (player) => {
        if(client.me.crown) {
            const dRoom: DatabaseRoom = JSON.parse(localStorage.getItem("room_"+client.wsUrl+client.channel)!)
            if(dRoom.banned.includes(player._id)) {
                client.kickban(player._id, 0)
            }
        }
    })

    client.on("message", (player: Player, message: string) => {
        if(!localStorage.getItem(client.wsUrl+player.id)) {
            localStorage.setItem(client.wsUrl+player.id, JSON.stringify({id: client.wsUrl+player.id, money: 0, rank: "", items: [], timeouts: []}))
        }

        const args = message.split(" ")
        const command = args.shift();

        if(command?.startsWith("p")) {
            const cc = commands.get(command.substring(1))
            if(cc) cc(player, client, args, commands)
        }
    })
}

config.servers.forEach(server => {
    new Multiclient(mClient).connect(server.url, server.token, server.rooms);
})
