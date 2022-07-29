import { Client, Player } from "../../classes/Client.ts";
import { DatabasePlayer, DatabaseRoom, getDRoom, setDRoom } from "../../classes/Database.ts";
import { Discord } from "../../classes/Discord.ts";

export default async function (player: Player, client: Client, __: unknown, _: unknown, discord: Discord)  {
    const dPlayer: DatabasePlayer = JSON.parse(localStorage.getItem(client.wsUrl+player.id)!);
    const dRoom: DatabaseRoom = getDRoom(client)!;

    if(dPlayer.rank == "bot-owner") {
        if(dRoom.discordEnabled) {
            dRoom.discordEnabled = false;

            discord.discord?.close();
            clearInterval(discord.bufferTimeout)
        } else {
            dRoom.discordEnabled = true;
            await discord.makeNewBridge(client);
        }

        setDRoom(dRoom, client);
        client.message("Discord is now: " + (dRoom.discordEnabled ? "Enabled." : "Disabled."))
    } else {
        client.message("You do not have permission!");
    }
}