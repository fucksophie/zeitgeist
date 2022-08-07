import { EventEmitter } from "https://deno.land/x/eventemitter@1.2.1/mod.ts";

export class Player {
  id!: string;
  _id!: string;
  name!: string;
  color!: string;

  tag?: {
    text: string;
    color: string;
  };

  crown?: boolean;

  x = 0;
  y = 0;
}

export class Client extends EventEmitter<{
  connect(): void;
  message(player: Player, message: string, client: Client): void;
  join(player: Player): void;
  mouse(x: number, y: number, id: string): void;
  namechange(now: Player, before: Player): void;
}> {
  wsUrl!: string;
  ws!: WebSocket;
  me!: Player;
  people: Player[] = [];
  channel!: string;
  alive = false;
  reconnectInterval = 0;
  messageBuffer: string[] = [];

  // 🦋 🐛 🐝 🐞 🐜 🕷 🕸 🦂 🦗 🦟 todo: pet the bugs :3

  private send(array: Record<string, unknown>) {
    if (this.alive) {
      this.ws.send(JSON.stringify(
        [array],
      ));
    }
  }

  userset(name?: string, color?: string) {
    this.send({
      m: "userset",
      set: {
        name,
        color,
      },
    });
  }

  message(message: string) {
    this.messageBuffer.push(message)
  }

  move(x: number, y: number) {
    this.send({
      m: "m",
      x: x.toFixed(2).toString(),
      y: y.toFixed(2).toString(),
    });
  }

  findUser(idorname: string) {
    return this.people.find((e) =>
      e.id == idorname || e.name.toLowerCase().includes(idorname.toLowerCase())
    );
  }

  giveCrown(id: string) {
    this.send({
      m: "chown",
      id,
    });
  }

  kickban(id: string, time: number) {
    this.send({
      m: "kickban",
      _id: id,
      ms: time,
    });
  }

  unban(id: string) {
    this.send({
      m: "unban",
      _id: id,
    });
  }

  boot(wsUrl: string, token: string, channel: string) {
    this.wsUrl = wsUrl;
    this.channel = channel;

    const tInterval = setInterval(() => {
      this.send({
        m: "t",
        e: Date.now(),
      });
    }, 15000);

    this.ws = new WebSocket(this.wsUrl);

    this.ws.addEventListener("open", () => {
      this.alive = true;

      this.send({ "m": "hi", "token": token });

      setInterval(()=>{
        if(this.messageBuffer.length != 0) {
          this.send({
            m: "a",
            message: this.messageBuffer.shift(),
          });
        }
      }, 500)
    });

    this.ws.addEventListener("close", () => {
      clearInterval(tInterval);
      clearInterval(this.reconnectInterval);
      this.alive = false;

      this.reconnectInterval = setTimeout(() => {
        this.boot(wsUrl, token, channel);
      }, 1000);
    });

    this.ws.addEventListener("error", () => {
      clearInterval(tInterval);
      clearInterval(this.reconnectInterval);
      this.alive = false;

      this.reconnectInterval = setTimeout(() => {
        this.boot(wsUrl, token, channel);
      }, 1000);
    });

    this.ws.addEventListener("message", (e) => {
      const json = JSON.parse(e.data);

      // deno-lint-ignore no-explicit-any
      json.forEach((message: any) => {
        if (message.m == "hi") {
          this.send({ m: "ch", "_id": channel });
          this.me = message.u;
        } else if (message.m == "ch") {
          if (this.people.length == 0) {
            this.emit("connect");
          }

          if (message.ch.crown) {
            this.me.crown = message.ch.crown.userId == this.me._id;
          } else {
            this.me.crown = false;
          }

          if (this.me.crown) {
            message.ppl.forEach((e: Player) => {
              this.emit("join", e);
            });
          }

          if (this.people.length !== 0) return;

          console.log(
            "Joined channel " + channel + ". People: " + message.ppl.length,
          );
          this.people = message.ppl;
        } else if (message.m == "p") {
          const found = this.people.find((e) => e.id == message.id);

          if (found) {
            if(found.name != message.name) {
              this.emit("namechange", message as Player, found)
            }

            this.people = this.people.filter((e) => e.id !== message.id);
            this.people.push(message);
            return;
          }

          this.people.push(message);

          this.emit("join", message);
        } else if (message.m == "bye") {
          this.people = this.people.filter((e) => e.id !== message.p);
        } else if (message.m == "a") {
          this.emit("message", message.p as Player, message.a, this);
        } else if (message.m == "m") {
          this.emit("mouse", +message.x, +message.y, message.id);
        }
      });
    });
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
    rooms.forEach((e) => {
      const client = new Client();

      this.boot(client);
      client.boot(url, token, e);
      this.clients.push(client);
    });
  }
}
