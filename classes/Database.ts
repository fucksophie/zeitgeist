import { Client } from "./Client.ts";

export interface DatabasePlayer {
  id: string;
  money: number;
  timeouts: string[];
  rank: string;
  items: { name: string; cost: number; amount: number; garbage: boolean }[];
}

export interface DatabaseRoom {
  ranks: Map<string, string>;
  discordEnabled?: boolean;
}

export function getDRoom(client: Client): DatabaseRoom | undefined {
  const room: DatabaseRoom = JSON.parse(
    localStorage.getItem("room_" + client.wsUrl + client.channel)!,
  );

  if (!room) {
    return;
  }

  room.ranks = new Map(room.ranks);

  return room;
}

export function getDPlayer(client: Client, player: {id: string}) {
  return (JSON.parse(
    localStorage.getItem(client.wsUrl + player.id)!,
  ) as DatabasePlayer);
}

export function setDPlayer(dPlayer: DatabasePlayer) {
  localStorage.setItem(dPlayer.id, JSON.stringify(dPlayer));
}

export function setDRoom(DR: DatabaseRoom, client: Client) {
  localStorage.setItem(
    "room_" + client.wsUrl + client.channel,
    JSON.stringify(
      { ...DR, ranks: [...DR.ranks] },
    ),
  );
}
