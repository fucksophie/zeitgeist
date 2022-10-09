import { Client, Player } from "../../classes/Client.ts";
import config from "../../config.json" assert { type: "json" };

export default function (_: Player, client: Client) {
  client.message(
    `Bot written as a replacement for Bouncer and MelonBot, moderating ${config.servers.length} servers, ${
      config.servers.map((e) => e.rooms.length).reduce((a, b) => a + b)
    } rooms. Created by ~yourfriend, input from Lapis and Wolfy. Zeit[g]eist (Database Rewrite)`,
  );
}
