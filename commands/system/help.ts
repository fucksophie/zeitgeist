import { Client, Player } from "../../classes/Client.ts";

export default function (
  _player: Player,
  client: Client,
  _args: string[],
  categories: Map<string, Map<string, string>>,
) {
  let amount = 0;

  categories.forEach((commands, category) => {
    const commandsString: string[] = [];
    amount++;

    commands.forEach((_, v1) => {
      commandsString.push(v1);
    });

    client.message(`${category}: ${commandsString.join(", ")}`);
  });
}
