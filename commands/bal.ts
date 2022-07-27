import { Client, Player } from "../Client.ts";

export default function (player: Player, client: Client)  {
    client.message(`@${player.id} has ${JSON.parse(localStorage.getItem(client.wsUrl+player.id)!).money}$#.`)
}