

import { Client, Player } from "../Client.ts";
import { DatabasePlayer } from "../Database.ts";

export default function (player: Player, client: Client)  {
    client.message(`@${player.id} has ${(JSON.parse(localStorage.getItem(client.wsUrl+player.id)!) as DatabasePlayer).items.map(e => e.name + " ("+e.cost+"$#) x" + e.amount).join(", ")}`)
}