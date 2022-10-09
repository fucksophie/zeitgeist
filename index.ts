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
    let room = await getDRoom(client);

    if (!room) {
      room = { ranks: new Map() };

      await setDRoom({ ranks: new Map() }, client);
    }

    if (room.discordEnabled) {
      await discord.makeNewBridge(client);
    }
  });

  client.on("namechange", async (now) => {
    const person = await getDPlayer(client, now);
    if (person.namehistory.at(-1) !== now.name) {
      person.namehistory.push(now.name);
      await setDPlayer(person);
    }
  });

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

  client.on("message", async (player: Player, message: string) => {
    if (discord && discord.channel && (await getDRoom(client))?.discordEnabled) {
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
