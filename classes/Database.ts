// deno-lint-ignore-file no-explicit-any
import { Client } from "./Client.ts";
import { Client as PgClient} from "https://deno.land/x/postgres@v0.15.0/mod.ts";
import config from "../config.json" assert { type: "json" };

const postgres = new PgClient(config.postgres);
await postgres.connect()

export interface DatabasePlayer {
  id: string;
  money: number;
  timeouts: string[];
  rank: string;
  namehistory: string[];
  items: { name: string; cost: number; amount: number; garbage: boolean }[];
}

export interface DatabaseRoom {
  ranks: Map<string, string>;
  discordEnabled?: boolean;
}

export async function getDRoom(client: Client): Promise<DatabaseRoom> {
  const query = await postgres.queryObject(`SELECT * FROM rooms WHERE id = $ID`, {
    id: "room_" + client.wsUrl + client.channel
  })
  
  if(query.rowCount == 0) return undefined as unknown as DatabaseRoom;
  
  const row = query.rows[0] as any;

  return {
    ranks: new Map(JSON.parse(row.ranks) as any),
    discordEnabled: row.discordenabled
  }
}

export async function getDPlayer(client: Client|undefined, player: { id: string }): Promise<DatabasePlayer> {
  const query = await postgres.queryObject(`SELECT * FROM users WHERE id = $ID`, {
    id: (client?.wsUrl || "") + player.id
  })
  
  if(query.rowCount == 0) return undefined as unknown as DatabasePlayer;
  
  const row = query.rows[0] as any;

  return {
    id: row.id,
    money: row.money,
    timeouts: JSON.parse(row.timeouts || "[]"),
    rank: row.rank,
    namehistory: JSON.parse(row.namehistory || "[]"),
    items: JSON.parse(row.items || "[]")
  } as DatabasePlayer;
}

export async function setDPlayer(dPlayer: DatabasePlayer): Promise<void> {
  const player = await getDPlayer(undefined, dPlayer); 
  if(player == undefined) {
    postgres.queryObject(`
        INSERT INTO users VALUES ($ID, $MONEY, $TIMEOUTS, $RANK, $HISTORY, $ITEMS)
    `, {
        id: dPlayer.id,
        money: dPlayer.money,
        timeouts: JSON.stringify(dPlayer.timeouts || "[]"),
        rank: dPlayer.rank,
        history: JSON.stringify(dPlayer.namehistory || "[]"),
        items: JSON.stringify(dPlayer.items || "[]")
    })
  } else {
    postgres.queryObject(`
      UPDATE users SET money = $MONEY, timeouts = $TIMEOUTS, rank = $RANK, namehistory = $HISTORY, items = $ITEMS WHERE id = $ID
    `, {         
      id: dPlayer.id,
      money: dPlayer.money,
      timeouts: JSON.stringify(dPlayer.timeouts || "[]"),
      rank: dPlayer.rank,
      history: JSON.stringify(dPlayer.namehistory || "[]"),
      items: JSON.stringify(dPlayer.items || "[]")
    })
  }
}

export async function setDRoom(DR: DatabaseRoom, client: Client) {
  const room = await getDRoom(client);

  if(room == undefined) {
    postgres.queryObject(`
        INSERT INTO rooms VALUES ($ID, $RANKS, $DISCORD)
    `, {
      id: "room_" + client.wsUrl + client.channel,
      ranks: JSON.stringify([...DR.ranks]),
      discord: DR.discordEnabled
    })
  } else {
    postgres.queryObject(`
      UPDATE rooms SET ranks = $RANKS, discordenabled = $DISCORD WHERE id = $ID
    `, {         
      id: "room_" + client.wsUrl + client.channel,
      ranks: JSON.stringify([...DR.ranks]),
      discord: DR.discordEnabled
    })
  }
}
