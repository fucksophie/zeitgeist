import { Client, Player } from "../../classes/Client.ts";

export default function (_: Player, client: Client) {
    client.message("Current lapis status: " + (localStorage.getItem("lapis") || "hasn't been set yet"));

}
