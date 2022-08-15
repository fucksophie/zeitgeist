import { Client, Multiclient, Player } from "./classes/Client.ts";
import config from "./config.json" assert { type: "json" };
import {
  getDPlayer,
  getDRoom,
  setDPlayer,
  setDRoom,
} from "./classes/Database.ts";
import { Discord } from "./classes/Discord.ts";

const getDomainWithoutSubdomain = (url: string) => {
  const urlParts = new URL(url).hostname.split(".");

  return urlParts
    .slice(0)
    .slice(-(urlParts.length === 4 ? 3 : 2))
    .join(".");
};

export const discord = new Discord();

for (let i = 0; i < localStorage.length; i++) {
  try {
    const player = JSON.parse(localStorage.getItem(localStorage.key(i)!)!);

    if (typeof player.money == "number") {
      player.timeouts = [];
      localStorage.setItem(player.id, JSON.stringify(player));
    }
  } catch {
    // okay who cares
  }
}

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
    client.userset("Zeit[g]eist", "#F8F8FF");
    let room = getDRoom(client);

    if (!room) {
      room = { ranks: new Map() };

      setDRoom({ ranks: new Map() }, client);
    }

    if (room.discordEnabled) {
      await discord.makeNewBridge(client);
    }
  });

  client.on("namechange", (now) => {
    const person = getDPlayer(client, now);

    if (person.namehistory.at(-1) !== now.name) {
      person.namehistory.push(now.name);
      setDPlayer(person);
    }
  });

  client.on("join", (player) => {
    if (!getDPlayer(client, player)) {
      setDPlayer({
        id: client.wsUrl + player._id,
        money: 0,
        timeouts: [],
        rank: "",
        items: [],
        namehistory: [],
      });
    }

    const person = getDPlayer(client, player);

    if (person.namehistory.at(-1) !== player.name) {
      person.namehistory.push(player.name);
      setDPlayer(person);
    }

    if (client.me.crown) {
      const dRoom = getDRoom(client)!;

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
        
        setDRoom(dRoom, client);
      }
    }
  });

  client.on("message", (player: Player, message: string) => {
    if (discord && discord.channel && getDRoom(client)?.discordEnabled) {
      if (message.startsWith("[Discord]") && player._id == client.me._id) {
        return;
      }
      discord.buffer.push(
        `**${player.name}** (${player._id}): ${message} || ${client.channel} in ${
          getDomainWithoutSubdomain(client.wsUrl)
        } ||`,
      );
    }

    const args = message.split(" ");
    const command = args.shift();

    if (command?.startsWith("g")) {
      categories.forEach(async (v) => {
        const cc = v.get(command.substring(1));

        if (cc) await cc(player, client, args, categories, discord);
      });
    }
  });
};

config.servers.forEach((server) => {
  new Multiclient(mClient).connect(server.url, server.token, server.rooms);
});
