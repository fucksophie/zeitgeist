import { Client, Player } from "../../classes/Client.ts";
import { DatabasePlayer } from "../../classes/Database.ts";

export default function (player: Player, client: Client) {
  const dPlayer: DatabasePlayer = JSON.parse(
    localStorage.getItem(client.wsUrl + player.id)!,
  );

  let total = 0;
  const final: string[] = [];

  dPlayer.items.forEach((b) => {
    if (b.garbage) {
      total += b.cost * b.amount;

      dPlayer.items = dPlayer.items.filter((e) => e.name !== b.name);

      final.push(`${b.name} ${b.amount}x`);
    }
  });

  dPlayer.money += total;

  localStorage.setItem(dPlayer.id, JSON.stringify(dPlayer));

  client.message(`@${player.id} sold: ${final.join(", ")}. +${total}$#.`);
}
