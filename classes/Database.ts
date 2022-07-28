import { Client } from "./Client.ts";

export interface DatabasePlayer {
    id: string
    money: number
    timeouts: string[]
    rank: string
    items: {name: string, cost: number, amount: number, garbage: boolean}[]
}

export interface DatabaseRoom {
    ranks: Map<string, string>
}

export function getDRoom(client: Client): DatabaseRoom|undefined {
    const room: DatabaseRoom = JSON.parse(localStorage.getItem("room_"+client.wsUrl+client.channel)!)
    JSON.parse(localStorage.getItem("room_wss://mppclone.com:8443The Roleplay Room")!)
    if(!room) {
        return;
    }

    room.ranks = new Map(room.ranks);
    
    return room;
}

export function setDRoom(DR: DatabaseRoom, client: Client) {
    localStorage.setItem("room_"+client.wsUrl+client.channel, JSON.stringify(
        {ranks: [...DR.ranks]}));
}