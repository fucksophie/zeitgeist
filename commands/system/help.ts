import { Client, Player } from "../../classes/Client.ts";

// deno-lint-ignore no-explicit-any
export default function (
  _player: Player,
  client: Client,
  _args: string[],
  categories: Map<string, Map<string, any>>,
) {
  let amount = 0;

  categories.forEach((commands, category) => {
    const commandsString: string[] = [];
    amount++;

    commands.forEach((_, v1) => {
      commandsString.push(v1);
    });

    setTimeout(() => {
      client.message(`${category}: ${commandsString.join(", ")}`);
    }, amount * 350);
  });
}
