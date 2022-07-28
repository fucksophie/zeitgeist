import { Client, Multiclient, Player } from "./classes/Client.ts";
import config from "./config.json" assert { type: "json" }
import { getDRoom, setDRoom } from "./classes/Database.ts";

for(let i = 0; i < localStorage.length; i++) { 
    const player = JSON.parse(localStorage.getItem(localStorage.key(i)!)!);
    if(typeof player.money == "number") {
        player.timeouts = []
        localStorage.setItem(player.id, JSON.stringify(player));
    }
}

// deno-lint-ignore no-explicit-any
const categories = new Map<string, Map<string, any>>();

for await (const categoryEntry of Deno.readDir("commands")) {
    if(categoryEntry.isDirectory) {
        for await (const commandEntry of Deno.readDir("commands/" + categoryEntry.name)) {
            const categoryMap = categories.get(categoryEntry.name) || new Map();
            categoryMap.set(commandEntry.name.split(".")[0], (await import(`./commands/${categoryEntry.name}/${commandEntry.name}`)).default)
            categories.set(categoryEntry.name, categoryMap);
        }
    }
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
            categories.forEach(v => {
                const cc = v.get(command.substring(1));

                if(cc) cc(player, client, args, categories)
            })
        }
    })
}

config.servers.forEach(server => {
    new Multiclient(mClient).connect(server.url, server.token, server.rooms);
})
