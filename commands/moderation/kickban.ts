import { Client, Player } from "../../classes/Client.ts";
import {
  DatabasePlayer,
  DatabaseRoom,
  getDRoom,
} from "../../classes/Database.ts";

export default function (player: Player, client: Client, args: string[]) {
  const dPlayer: DatabasePlayer = JSON.parse(
    localStorage.getItem(client.wsUrl + player.id)!,
  );
  const dRoom: DatabaseRoom = getDRoom(client)!;

  if (
    dRoom.ranks.get(player.id) == "room-operator" ||
    dRoom.ranks.get(player.id) == "room-owner" || dPlayer.rank == "bot-owner"
  ) {
    if (args.length < 2) {
      client.message("Missing arguments (2).");
      return;
    }

    const user = client.people.find((e) => e.id == args[0]);

    if (isNaN(+args[1])) {
      client.message(args[1] + " is not a number.");
      return;
    }

    if ((+args[1]) > 300) {
      client.message("Max kickban time is 300 minutes.");
      return;
    }

    if (user) {
      if (user._id == client.me._id) {
        client.message("You cannot kickban the bot!");
        return;
      }

      if (
        dRoom.ranks.get(user._id) ||
        JSON.parse(localStorage.getItem(client.wsUrl + user._id)!)?.rank ==
          "bot-owner"
      ) {
        client.message("You cannot kickban ranked players!");
        return;
      }

      client.kickban(args[0], (+args[1]) * 60000);
    }
  } else {
    client.message("You do not have permission!");
  }
}
