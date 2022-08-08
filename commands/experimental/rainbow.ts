import { Client, Player } from "../../classes/Client.ts";
import { DatabaseRoom, getDPlayer, getDRoom } from "../../classes/Database.ts";

const rainbowIntervals: Map<string, number> = new Map<
  string,
  number
>();

function co(lor: string): string {
  return (lor += [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
    ][Math.floor(Math.random() * 16)]) && (lor.length == 6)
    ? lor
    : co(lor);
}

export default function (player: Player, client: Client) {
  const dPlayer = getDPlayer(client, player);

  const dRoom: DatabaseRoom = getDRoom(client)!;

  if (
    dRoom.ranks.get(player.id) == "room-owner" || dPlayer.rank == "bot-owner"
  ) {
    if (rainbowIntervals.get(client.wsUrl + client.channel)) {
      clearInterval(rainbowIntervals.get(client.wsUrl + client.channel));
      rainbowIntervals.delete(client.wsUrl + client.channel);
      client.message("Stopped.");
      client.channelset({
        color: "#000000",
        color2: "#000000",
      });
    } else {
      rainbowIntervals.set(
        client.wsUrl + client.channel,
        setInterval(() => {
          client.channelset({
            color: "#" + co(""),
            color2: "#" + co(""),
          });
        }, 1000),
      );

      client.message("WEEEEEEEEEEEE!!!");
    }
  } else {
    client.message("You do not have permission!");
  }
}
