import { Client, Player } from "../Client.ts";

// deno-lint-ignore no-explicit-any
export default function (_player: Player, client: Client, _args: string[], commands: Map<string, any>)  {
    client.message(`Commands available: ` + [...commands.keys()].join(', '))
}