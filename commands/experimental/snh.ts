import { Client, Player } from "../../classes/Client.ts";

export default async function (_: Player, client: Client, args: string[]) {
  const data = await fetch(
    `https://mpp.seq37.dev:13164/?query=${encodeURIComponent(args.join(""))}`,
  );
  const json = await data.json();

  if (json.type == "nick") {
    `Found data with type Nick. ID's: ${
      json.data.map((e: { id: string }) => e.id).join(", ")
    }`.match(/.{1,511}/g)?.forEach((x) => {
      client.message(x);
    });
  } else if (json.type == "id") {
    `Found data with type ID->Nick. Last found: ${
      json.data.rooms.at(-1).ch
    } at ${new Date(json.data.rooms.at(-1).ts).toUTCString()}. Nicks's: ${
      json.data.nicknames.map((e: { name: string }) => e.name).join(", ")
    }.`.match(/.{1,511}/g)?.forEach((x) => {
      client.message(x);
    });
  } else if (json.type == "none") {
    client.message("No data could be found.");
  }
}
