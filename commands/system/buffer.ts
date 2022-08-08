import { Client, Player } from "../../classes/Client.ts";

export default function (_: Player, client: Client) {
  client.messageBuffer = [];
  client.message(`Buffer cleared.`);
}
