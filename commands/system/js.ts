import { Client, Player } from "../../classes/Client.ts";
import { getDPlayer } from "../../classes/Database.ts";

export default function (player: Player, client: Client, args: string[]) {
  const dPlayer = getDPlayer(client, player);

  if (dPlayer.rank == "bot-owner") {
    try {
      const output = eval(args.join(" "));
      client.message("Output: " + output);
    } catch (e) {
      client.message("Error: " + e);
    }
  } else {
    client.message("You are not the owner of this bot.");
  }
}
