import { Client, Player } from "../../classes/Client.ts";
import { getDPlayer } from "../../classes/Database.ts";

export default async function (player: Player, client: Client) {
  const dPlayer = getDPlayer(client, player);
 
  if (dPlayer.rank == "bot-owner") {
    const pull = Deno.run({cmd:["git", "pull"]});

    client.message("Updating..");

    await pull.status();

    client.message("Finished. Restarting..");

    setTimeout(() => {
        Deno.exit(0) // This is ran with a assumption your bot autorestarts after a crash
    }, 100);
  } else {
    client.message("You are not the owner of this bot.");
  }
}
