import { Client, Player } from "../../classes/Client.ts";
import { DatabasePlayer, getDPlayer } from "../../classes/Database.ts";

export default function (player: Player, client: Client, args: string[]) {
  let findingPlayer = client.findUser(args.join(" "));
  let dPlayer: DatabasePlayer | undefined;

  if (args.length == 0) findingPlayer = undefined;

  if (findingPlayer) {
    dPlayer = getDPlayer(client, findingPlayer);
  } else {
    dPlayer = getDPlayer(client, { id: args.join(" ") });
  }

  if (dPlayer) {
    `${(dPlayer.namehistory[0] || dPlayer.id)}'s namehistory: ${
      dPlayer.namehistory.join(", ")
    }.`.match(/.{1,511}/g)?.forEach((x) => {
      client.message(x);
    });
  } else {
    `Your namehistory: ${getDPlayer(client, player).namehistory.join(", ")}.`
      .match(/.{1,511}/g)?.forEach((x) => {
        client.message(x);
      });
  }
}
