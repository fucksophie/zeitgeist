import { Client, Player } from "../../classes/Client.ts";
import { DatabaseRoom, getDPlayer, getDRoom } from "../../classes/Database.ts";

export default async function (player: Player, client: Client) {
  const dPlayer = await getDPlayer(client, player);

  const dRoom: DatabaseRoom = await getDRoom(client)!;

  if (
    dRoom.ranks.get(player.id) == "room-owner" || dPlayer.rank == "bot-owner"
  ) {
    if (client.settings.crownsolo) {
      client.message("Enabled piano!");
      client.channelset({
        crownsolo: false,
      });
    } else {
      client.message("Disabled piano.");
      client.channelset({
        crownsolo: true,
      });
    }
  } else {
    client.message("You do not have permission!");
  }
}
