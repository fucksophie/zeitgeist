import { Client, Player } from "../../classes/Client.ts";
import { getDPlayer, setDPlayer } from "../../classes/Database.ts";
import config from "../../config.json" assert { type: "json" };

export default async function (player: Player, client: Client, args: string[]) {
    const dPlayer = await getDPlayer(client, player);
    
    const time = 60000 * 2;

    const found = dPlayer.timeouts.find(x => x.startsWith("suggest-"));

    if (found) {
        if((+found.split("-")![1]!) > Date.now()) {
            client.message(`@${player.id} Please wait two minutes.`);
            return;
        } else {
            dPlayer.timeouts = dPlayer.timeouts.filter(x => !x.startsWith("suggest-"));
        }
    }

    const suggestion = args.join(" ").trim()
    if(!suggestion.length || suggestion.includes("@everyone") || suggestion.includes("@here")) {
        client.message(
            `@${player.id} Your suggestion is invalid.`,
        );
        return;
    }

    dPlayer.timeouts.push("suggest-" + (Date.now() + time));

    await setDPlayer(dPlayer);

    const req = await fetch(config.suggestions, {
        headers: {
            "Content-Type": "application/json"
        }, 
        method: "POST",
        body: JSON.stringify({
            "content": null,
            "embeds": [
                {
                    "title": "New suggestion!",
                    "description": "\""+suggestion+"\"\n**Name: ** "+player.name+"\n**ID: ** "+player._id,
                    "color": 5814783
                }
            ],
            "attachments": []
        })
    })

    if(req.ok) {
        client.message(
            `@${player.id} Your suggestion has sucessfully registered!`,
        );
    } else {
        client.message(
            `@${player.id} @${player.id} Something went SERIOUSLY WRONG! Please DM yourfriend or Lapis!`,
        );
    }

}
