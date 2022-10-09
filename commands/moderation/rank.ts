import { Client, Player } from "../../classes/Client.ts";
import { DatabaseRoom, getDPlayer, getDRoom } from "../../classes/Database.ts";

export default async function (player: Player, client: Client, args: string[]) {
  const dRoom: DatabaseRoom = await getDRoom(client)!;

  if (args?.[0]) {
    const dPlayer = await getDPlayer(client, { id: args[0] });

    if (dPlayer) {
      client.message(
        args[0] + "'s rank is: " + (dPlayer.rank || "(none)") +
          ". Room rank: " + (dRoom.ranks.get(args[0]) || "(none)"),
      );
    } else {
      client.message("Player does not exist.");
    }
  } else {
    const dPlayer = await getDPlayer(client, player);

    client.message(
      player.name + "'s rank is: " + (dPlayer.rank || "(none)") +
        ". Room rank: " + (dRoom.ranks.get(player.id) || "(none)"),
    );
  }
}
