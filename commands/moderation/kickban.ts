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
    if (args[0] == client.me._id) {
      client.message("You cannot kickban the bot!");
      return;
    }

    if(args[0] == player.id) {
      client.message("You cannot kickban yourself!")
      return;
    }

    if (dRoom.ranks.get(args[0])?.startsWith("kickban")) {
      client.message("This user is already kickbanned.");
      return;
    }

    if (dRoom.ranks.get(args[0]) == "banned") {
      client.message("This user is already banned.");
      return;
    }

    if (
      dRoom.ranks.get(args[0]) ||
      (await getDPlayer(client, { id: args[0] }))?.rank ==
        "bot-owner"
    ) {
      client.message("You cannot kickban ranked players!");
      return;
    }

    if (user) {
      client.kickban(args[0], (+args[1]) * 60000);
    } else {
      client.message("Kickbanned offline user " + args[0] + ".");
      dRoom.ranks.set(args[0], "kickban-" + (Date.now() + (+args[1]) * 60000));

      await setDRoom(dRoom, client);
    }
  } else {
    client.message("You do not have permission!");
  }
}
