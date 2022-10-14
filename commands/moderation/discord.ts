import { Client, Player } from "../../classes/Client.ts";
import {
  DatabaseRoom,
  getDPlayer,
  getDRoom,
  setDRoom,
} from "../../classes/Database.ts";

export default async function (
  player: Player,
  client: Client,
  __: unknown,
  _: unknown,
) {
  const dPlayer = await getDPlayer(client, player);

  const dRoom: DatabaseRoom = await getDRoom(client)!;

  if (dPlayer.rank == "bot-owner") {
    await setDRoom(dRoom, client);
    client.message(
      "Discord is now: " + (dRoom.discordEnabled ? "Enabled." : "Disabled."),
    );
  } else {
    client.message("You do not have permission!");
  }
}
