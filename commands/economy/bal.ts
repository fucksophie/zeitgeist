import { Client, Player } from "../../classes/Client.ts";
import { getDPlayer } from "../../classes/Database.ts";

export default async function (player: Player, client: Client) {
  client.message(
    `@${player.id} has ${(await getDPlayer(client,player)).money}$#.`,
  );
}
