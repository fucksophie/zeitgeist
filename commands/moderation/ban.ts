import { Client, Player } from "../../classes/Client.ts";
import {
  DatabaseRoom,
  getDPlayer,
  getDRoom,
  setDRoom,
} from "../../classes/Database.ts";

export default async function (player: Player, client: Client, args: string[]) {
  const dPlayer = await getDPlayer(client, player);

  const dRoom: DatabaseRoom = await getDRoom(client)!;

  if (
    dRoom.ranks.get(player.id) == "room-operator" ||
    dRoom.ranks.get(player.id) == "room-owner" || dPlayer.rank == "bot-owner"
  ) {
    if (!args[0]) {
      client.message("Missing argument.");
      return;
    }

    const user = client.people.find((e) => e.id == args[0]);

    if (args[0] == client.me._id) {
      client.message("You cannot ban the bot!");
      return;
    }

    if (
      dRoom.ranks.get(args[0]) ||
      (await getDPlayer(client, { id: args[0] }))?.rank ==
        "bot-owner"
    ) {
      client.message("You cannot ban ranked players!");
      return;
    }

    if (user) {
      client.message("User " + user.name + " banned.");
      client.kickban(args[0], 1.8e+6);
    } else {
      client.message("Offline user " + args[0] + " banned.");
    }

    dRoom.ranks.set(args[0], "banned");

    await setDRoom(dRoom, client);
  } else {
    client.message("You do not have permission!");
  }
}
