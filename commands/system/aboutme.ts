import { Client, Player } from "../../classes/Client.ts";
import { DatabaseRoom, getDPlayer, getDRoom } from "../../classes/Database.ts";

export default async function (player: Player, client: Client) {
  const dPlayer = await getDPlayer(client,player);
  const dRoom: DatabaseRoom = await getDRoom(client)!;
  client.message(`Server ID: ${player.id}, Internal ID: ${client.wsUrl + player.id}, Balance: ${dPlayer.money}, Items: ${dPlayer.items.length}, Internal Namehistory: ${dPlayer.namehistory.length}, Rank: ${dPlayer.rank}, Room rank: ${dRoom.ranks.get(player.id)}, Timeouts (contact yf if there is one): ${JSON.stringify(dPlayer.timeouts)}`);
}
