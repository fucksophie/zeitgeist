import { Client, Player } from "../../classes/Client.ts";
import { getDPlayer } from "../../classes/Database.ts";

export default function (player: Player, client: Client) {
  client.message(
    `@${player.id} has ${getDPlayer(client, player).money}$#.`,
  );
}
