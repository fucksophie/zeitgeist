import { Client, Player } from "../../classes/Client.ts";

export default async function (_: Player, client: Client, args: string[]) {
  const data = await fetch(
    `https://mpp.seq37.dev:13164/?query=${encodeURIComponent(args.join(""))}`,
  );
  const json = await data.json();

  if (json.type == "nick") {
    client.message(
      `Found data with type Nick. ID's: ${
        json.data.map((e: { id: string }) => e.id).join(", ")
      }`,
    );
  } else if (json.type == "id") {
    const names: string[] = [
      ...new Set(
        json.data.nicknames.map((e: { name: string }) => e.name).filter((
          o: string,
          i: number,
          x: string[],
        ) => !i || (o != x[i - 1])),
      ),
    ] as string[];

    client.message(
      `Last found: ${json.data.rooms.at(-1).ch} at ${
        new Date(json.data.rooms.at(-1).ts).toUTCString()
      }. Nicks's (${names.length}): ${names.join(", ")}.`,
    );
  } else if (json.type == "none") {
    client.message("No data could be found.");
  }
}
