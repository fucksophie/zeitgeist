import { Client, Player } from "../../classes/Client.ts";
import { getDPlayer, setDPlayer } from "../../classes/Database.ts";

// deno-lint-ignore require-await
export default async function (player: Player, client: Client, args: string[]) {
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
