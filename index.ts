import { Client, Multiclient, Player } from "./classes/Client.ts";
import config from "./config.json" assert { type: "json" };
import {
  getDPlayer,
  getDRoom,
  setDPlayer,
  setDRoom,
} from "./classes/Database.ts";

// deno-lint-ignore no-explicit-any
const categories = new Map<string, Map<string, any>>();

for await (const categoryEntry of Deno.readDir("commands")) {
  if (categoryEntry.isDirectory) {
    for await (
      const commandEntry of Deno.readDir("commands/" + categoryEntry.name)
    ) {
      const categoryMap = categories.get(categoryEntry.name) || new Map();
      categoryMap.set(
        commandEntry.name.split(".")[0],
        (await import(`./commands/${categoryEntry.name}/${commandEntry.name}`))
          .default,
      );
      categories.set(categoryEntry.name, categoryMap);
    }
  }
}

const mClient = (client: Client) => {
  client.on("connect", async () => {
    const username = config?.user?.name || "Zeit[g]eist";
    const color = config?.user?.color || "#F8F8FF";
    client.userset(username, color);
    let room = await getDRoom(client);

    if (!room) {
      room = { ranks: new Map() };

      await setDRoom({ ranks: new Map() }, client);
    }
  });

  client.on("namechange", async (now) => {
    const person = await getDPlayer(client, now);
    if (person.namehistory.at(-1) !== now.name) {
      person.namehistory.push(now.name);
      await setDPlayer(person);
    }
  });

  client.on("channelSent", x => {
    if(!x.crown?.participantId) {
      const timeLeft = 15000 - (Date.now() - x.crown.time);
    
      console.log(`[${client.channel}] Crown dropped. Picking up in ${timeLeft}ms.`)
    
      setTimeout(() => {
        console.log(`[${client.channel}] Attempting pickup..`)
        client.giveCrown(client.me._id);

        setTimeout(() => {
          if(client.me.crown) console.log(`[${client.channel}] Good job! Crown gotten.`)
        }, 1000)
      
      }, timeLeft)
    }
  })

  client.on("join", async (player) => {
    if (!await getDPlayer(client, player)) {
      await setDPlayer({
        id: client.wsUrl + player._id,
        money: 0,
        timeouts: [],
        rank: "",
        items: [],
        namehistory: [],
      });
    }

    const person = await getDPlayer(client,player);

    if (person.namehistory.at(-1) !== player.name) {
      person.namehistory.push(player.name);
      await setDPlayer(person);
    }

    if (client.me.crown) {
      const dRoom = await getDRoom(client)!;

      if (dRoom.ranks.get(player._id) == "banned") {
        client.kickban(player._id, 1.8e+6);
      } else if (dRoom.ranks.get(player._id)?.startsWith("kickban")) {
        client.message("This kickban was a offline-user-based kickban.");
        const time =
          ((+dRoom.ranks.get(player._id)?.split("-").at(-1)!) - Date.now());

        if (time > 0) {
          client.kickban(player._id, time);
        }

        dRoom.ranks.delete(player._id);
        
        await setDRoom(dRoom, client);
      }
    }
  });

  client.on("message", (player: Player, message: string) => {
    const args = message.split(" ");
    const command = args.shift();
    const prefix = config?.user?.prefix || "g";

    if (command?.startsWith(prefix)) {
      categories.forEach(async (v) => {
        const cc = v.get(command.substring(prefix.length));

        if (cc) await cc(player, client, args, categories);
      });
    }
  });
};

config.servers.forEach((server) => {
  new Multiclient(mClient).connect(server.url, server.token, server.rooms);
});
