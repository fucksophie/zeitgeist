

import { Client, Player } from "../Client.ts";
import { DatabasePlayer } from "../index.ts";

export default function (player: Player, client: Client)  {
    client.message(`@${player.id} has ${(JSON.parse(localStorage.getItem(player.id)!) as DatabasePlayer).items.map(e => e.name + " ("+e.cost+"$#) x" + e.amount).join(", ")}`)
}