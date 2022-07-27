import {EventEmitter} from "https://deno.land/x/eventemitter@1.2.1/mod.ts"

export class Player {
    id!: string
    _id!: string
    name!: string
    color!: string
    
    tag?: {
        text: string
        color: string
    }
    
    crown?: boolean

    x = 0
    y = 0
}

export class Client extends EventEmitter<{
    connect(): void
    message(player: Player, message: string): void
    join(player: Player): void
    mouse(x: number, y: number, id: string): void
}> {
    wsUrl!: string
    ws!: WebSocket;
    me!: Player;
    people: Player[] = [];
    channel!: string;
    alive = false;
    
    // 🦋 🐛 🐝 🐞 🐜 🕷 🕸 🦂 🦗 🦟.

    // deno-lint-ignore no-explicit-any
    private send(array: Record<string, any>) {
        if(this.alive) {
            this.ws.send(JSON.stringify(
                [array]
            ))
        }
    }

    userset(name: string|undefined, color: string|undefined) {
        this.send({
            m: "userset",
            set: {
                name,
                color
            }
        })
    }

    message(message: string) {
        this.send({
            m: "a",
            message
        })
    }

    move(x: number, y: number) {
        this.send({
            m: "m",
            x: x.toFixed(2).toString(),
            y: y.toFixed(2).toString()
        })
    }

    findUser(idorname: string) {
        return this.people.find(e =>
            e.id == idorname || e.name.startsWith(idorname) || e.name.includes(idorname)
        )
    }

    giveCrown(id: string) {
        this.send({
            m: "chown",
            id
        })
    }

    kickban(id: string, time: number) {
        this.send({
            m: "kickban",
            _id: id,
            ms: time
        })
    }

    boot(wsUrl:string, token: string, channel: string) {        
        this.wsUrl = wsUrl;
        this.channel = channel;

        const tInterval = setInterval(() => {
            this.send({
                m: "t",
                e: Date.now()
            })
        }, 15000)

        this.ws = new WebSocket(this.wsUrl);

        this.ws.addEventListener("open", () => {
            this.send({"m":"hi", "token": token})
            this.alive = true;
        })

        this.ws.addEventListener("close", (r) => {
            console.log(r)
            this.alive = false;
            
            clearInterval(tInterval)
            setTimeout(() => {
                this.boot(wsUrl, token, channel);
            }, 10000);
        })
        
        this.ws.addEventListener("error", e => {
            console.log(e)
            clearInterval(tInterval)
            this.alive = false;

            setTimeout(() => {
                this.boot(wsUrl, token, channel);
            }, 10000);
        })
        this.ws.addEventListener("message", (e) => {
            const json = JSON.parse(e.data);
            // deno-lint-ignore no-explicit-any
            json.forEach((message: any) => {
                if(message.m == "hi") {
                    this.send({m: "ch", "_id": channel})
                    this.me = message.u;
                } else if(message.m == "ch") {
                    if(this.people.length == 0) {
                        this.emit("connect");
                    }

                    if(message.ch.crown) {
                        this.me.crown = message.ch.crown.userId == this.me._id                        
                    } else {
                        this.me.crown = false
                    }
                    
                    if(this.me.crown) {
                        message.ppl.forEach((e: Player) => {
                            this.emit("join", e)
                        })
                    }
                    
                    if(this.people.length !== 0) return;
                                        
                    console.log("Joined channel " + channel + ". People: " + message.ppl.length)
                    this.people = message.ppl;
                } else if(message.m == "p") {
                    if(this.people.find(e => e.id == message.id)) {
                        this.people = this.people.filter(e => e.id !== message.id)
                        this.people.push(message);
                        return;
                    }

                    this.people.push(message);

                    this.emit("join", message)
                } else if(message.m == "bye") {
                    this.people = this.people.filter(e => e.id !== message.p)
                } else if(message.m == "a") {
                    this.emit("message", message.p as Player, message.a);
                } else if(message.m == "m") {
                    this.emit("mouse", +message.x, +message.y, message.id);
                }
            })
        })
    }
}

interface ClientFunction {
    (client: Client): void;
}

export class Multiclient {
    private clients: Client[] = [];
    private boot: ClientFunction;

    constructor(callback: ClientFunction) {
        this.boot = callback;
    }

    connect(url: string, token: string, rooms: string[]) {
        rooms.forEach(e => {
            const client = new Client();
    
            this.boot(client);
            client.boot(url, token, e);
            this.clients.push(client)
        })
    }
}