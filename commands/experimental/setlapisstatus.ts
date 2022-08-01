import { Client, Player } from "../../classes/Client.ts";
import { getDPlayer } from "../../classes/Database.ts";

export default function (player: Player, client: Client, args: string[]) {
  const dPlayer = getDPlayer(client, player);

  if(dPlayer.rank == "lapis") {
    localStorage.setItem("lapis", args.join(" "))
    client.message("Hi Lapis. I set your status to \"" + localStorage.getItem("lapis") + "\" :)")
  } else {
    client.message("TIP: You cannot use this command! Only Lapis can. Not even the owner.")
  }
}
