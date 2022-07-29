import { Client } from "./Client.ts";
import config from "../config.json" assert { type: "json" } 
import {
    Client as DiscordClient,
    Message,
    GatewayIntents,
    TextChannel,
} from "https://deno.land/x/harmony@v2.6.0/mod.ts"

export class Discord {
    discord?: DiscordClient;
    channel?: TextChannel;
    buffer: string[] = [];
    bufferTimeout = 0;

    async makeNewBridge(client: Client) {
        if(!this.bufferTimeout) {
            this.bufferTimeout = setInterval(() => {
                if(this.buffer.length != 0) {
                    this.channel?.send(this.buffer.join("\n"));
                    this.buffer = []
                }
            }, 250)
        }

        if(!this.discord) {
            this.discord = new DiscordClient()

            this.discord.on('ready', async () => {
                console.log(`Ready! User: ${this.discord!.user?.tag}`)
                this.channel = await this.discord?.channels.fetch(config.discord.id)!;
            })
            
            this.discord.on('messageCreate', (msg: Message): void => {
                if(msg.author.id == this.discord?.user?.id) return;

                if(config.discord.id == msg.channelID) {
                    client.message("[Discord] " + msg.author.tag + ": " + msg.content)
                }
            }) 
            
            await this.discord.connect(config.discord.token, [
                GatewayIntents.GUILDS,
                GatewayIntents.GUILD_MESSAGES
            ])
        }
        
        client.on("message", (p, m) => {
            if(this.discord && this.channel) {
                this.buffer.push(`**${p.name}** (${p._id}): ${m}`)
            }
        })
    }

}