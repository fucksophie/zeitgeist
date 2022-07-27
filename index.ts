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
    })

    client.on("message", (player: Player, message: string) => {
        if(!localStorage.getItem(player.id)) {
            localStorage.setItem(player.id, JSON.stringify({id: player.id, money: 0, rank: "", items: [], timeouts: []}))
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
