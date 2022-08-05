import { Client, Player } from "../../classes/Client.ts";
import {
  DatabaseRoom,
  getDPlayer,
  getDRoom,
  setDRoom,
} from "../../classes/Database.ts";

export default function (player: Player, client: Client, args: string[]) {
  const dPlayer = getDPlayer(client, player);

  const dRoom: DatabaseRoom = getDRoom(client)!;

  if (
    dRoom.ranks.get(player.id) == "room-operator" ||
    dRoom.ranks.get(player.id) == "room-owner" || dPlayer.rank == "bot-owner"
  ) {
    if (!args[0]) {
      client.message("Missing argument.");
      return;
    }

    if (dRoom.ranks.get(args[0]) == "banned") {
      client.message("User " + args[0] + " has been unbanned.");
      dRoom.ranks.delete(args[0]);
    } else if (dRoom.ranks.get(args[0])?.startsWith("kickban")) {
      client.message(
        "User " + args[0] + " has been un-off-line-kick-ban-ed..?",
      );
      dRoom.ranks.delete(args[0]);
    } else {
      client.message(
        "User " + args[0] +
          " is not banned. (If banned via kickban, try rejoining.)",
      );
    }

    client.unban(args[0]);

    setDRoom(dRoom, client);
  } else {
    client.message("You do not have permission!");
  }
}
