import { Client, Player } from "../../classes/Client.ts";
import { Facts } from "../../classes/Data.ts";

export default function (_: Player, client: Client) {
    const amount = Facts.length;
    const id = Math.floor(amount* Math.random());
    
    client.message(`Fun fact: ${Facts[id].text} (#${id}/${amount})`);
}
