import { Client, Player } from "../../classes/Client.ts";
import {
  getDPlayer,
  DatabaseRoom,
  getDRoom,
} from "../../classes/Database.ts";

export default function (player: Player, client: Client) {
  const dPlayer = getDPlayer(client, player);

  const dRoom: DatabaseRoom = getDRoom(client)!;

  if (
    dRoom.ranks.get(player.id) == "room-owner" || dPlayer.rank == "bot-owner"
  ) {
    if (!client.me.crown) {
      client.message("I do not have the crown.");
      return;
    }

    client.giveCrown(player.id);
    client.message("The crown is now yours.");
  } else {
    client.message("You do not have permission!");
  }
}
