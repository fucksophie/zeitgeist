import { Client, Player } from "../Client.ts";
import config from "../config.json" assert { type: "json" }

export default function (_: Player, client: Client)  {
    client.message(`Bot written as a replacement for Bouncer and MelonBot. Database: ${localStorage.length}, moderating ${config.servers.length} servers, ${config.servers.map(e=>e.rooms.length).reduce((a,b)=>a+b)} rooms. Created by ~yourfriend. Zeit[g]eist`)
}