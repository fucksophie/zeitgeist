import { Client, Player } from "../../classes/Client.ts";
import { DatabasePlayer } from "../../classes/Database.ts";

export default function (player: Player, client: Client) {
  client.message(
    `@${player.id} has ${
      (JSON.parse(
        localStorage.getItem(client.wsUrl + player.id)!,
      ) as DatabasePlayer).items.map((e) =>
        e.name + " (" + e.cost + "$#) x" + e.amount
      ).join(", ")
    }`,
  );
}
