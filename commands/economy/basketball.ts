import { Client, Player } from "../../classes/Client.ts";
import { DatabasePlayer } from "../../classes/Database.ts";

export default function (player: Player, client: Client)  {
    const dPlayer: DatabasePlayer = JSON.parse(localStorage.getItem(client.wsUrl+player.id)!);

    if(!dPlayer.items.find(e => e.name == "basketball")) {
        client.message(`@${player.id} AYO WHERE YOUR BASKETBALL AT`)
        return;
    }

    if(dPlayer.timeouts.includes("balls")) {
        client.message(`@${player.id} cant ball 2 balls at da same time??`)
        return;
    } else {
        dPlayer.timeouts.push("balls");
        localStorage.setItem(dPlayer.id, JSON.stringify(dPlayer));
    }

    client.message(`@${player.id} started ballin!! ${"ㅤ".repeat(Math.floor(Math.random() * 15))}•`);


    setTimeout(() => {
        const money = Math.floor(Math.random() * 100) ;

        client.message(`@${player.id}, finished ballin. Won NBA. Earned ${money}$#.`);

        dPlayer.money += money;
        dPlayer.timeouts = dPlayer.timeouts.filter(e => e !== "balls")
        
        localStorage.setItem(dPlayer.id, JSON.stringify(dPlayer));

    }, Math.random() * 30000)
}