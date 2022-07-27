import { Client, Multiclient, Player } from "./Client.ts";
import config from "./config.json" assert { type: "json" }

for(let i = 0; i < localStorage.length; i++) { // clear all timeouts so no issues
    const player = JSON.parse(localStorage.getItem(localStorage.key(i)!)!);
    player.timeouts = []
    localStorage.setItem(player.id, JSON.stringify(player));
}

// deno-lint-ignore no-explicit-any
function fyShuffle(arr: any[]) { // SUPEERRRR GOOD SHUFFLE WITH VERRRYYYY GOOD PROSSIBLLIIYYYYYY :thunsbUP;
    let i = arr.length;
    while (--i > 0) {
      const randIndex = Math.floor(Math.random() * (i + 1));
      [arr[randIndex], arr[i]] = [arr[i], arr[randIndex]];
    }
    return arr;
}

const FarmItems = [
    {name: "ballsac", cost: 69, garbage: true},
    {name: "among us apple", cost: 111, garbage: true},
    {name: "singular egg", cost: 10, garbage: true},
    {name: "anony rabbit", cost: 50, garbage: true},
    {name: "AMONG US TOES", cost: 100, garbage: true},
    {name: "ak47", cost: 420, garbage: true},
    {name: "among us toes 2 new version", cost: 11, garbage: true},
    {name: "hackapple", cost: 12},
    {name: "grantfruit", cost: 1, garbage: true},
    {name: "Lapis Lazuli", cost: 92, garbage: true},
    {name: "grantfruit", cost: 12, garbage: true},
    {name: "anonywood", cost: 2, garbage: true},
    {name: "anonyiron", cost: 20, garbage: true},
    {name: "basketball", cost: 500},
    {name: "anonydiamond", cost: 10, garbage: true},
    {name: "anonygold", cost: 20, garbage: true},
    {name: "soda", cost: 2, garbage: true},
    {name: "OBAMNA", cost: 7, garbage: true}
]

const mClient = (client: Client) => {
    let currentlyFollowing = "";
     
    client.on("connect", () => {
        client.userset("[p] AppleBot 🍎", "#ff0000");
    })

    client.on("mouse", (x: number, y: number, id: string) => {
        if(id == currentlyFollowing) {
            client.move(x, y);
        }
    })

    client.on("message", (player: Player, message: string) => {
        if(!localStorage.getItem(player.id)) {
            localStorage.setItem(player.id, JSON.stringify({id: player.id, money: 0, items: [], timeouts: []}))
        }
        
        const dPlayer: {id: string, money: number,timeouts: string[], items: {name: string, cost: number, amount: number, garbage: boolean}[]} = JSON.parse(localStorage.getItem(player.id)!);

        const args = message.split(" ")
        const command = args.shift();

        if(command == "pfollow") {
            if(args?.[0]) {
                const f = client.findUser(args[0]);

                if(f) {
                    client.message("Okay, now following " + f.name + ".");
                    currentlyFollowing = f.id;
                } else {
                    client.message("Couldn't find user.")
                }
            } else {
                client.message("Okay, following you.");
                currentlyFollowing = player.id;
            }
        }
        if(command == "pjs") {
            if(player.id == "3bff3f33e6dc0410fdc61d13") {
                try {
                    const output = eval(args.join(""))
                    client.message("Output: " + output)
                } catch(e) {
                    client.message("Error: " + e)
                }
            } else {
                client.message("ur not @3bff3f33e6dc0410fdc61d13")
            }
        }
        if(command == "pid") {
            client.message("Your ID is " + player.id);
        }

        if(command == "pbasketball") {
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

        if(command == "pbal") {
            client.message(`@${player.id} has ${dPlayer.money}$#.`)
        }

        if(command == "psellgarbage") {
            let total = 0;
            const final: string[] = [];

            dPlayer.items.forEach(b => {
                if(b.garbage) {
                    total += b.cost * b.amount;
                    
                    dPlayer.items = dPlayer.items.filter(e => e.name !== b.name);
                    

                    final.push(`${b.name} ${b.amount}x`);
                }
            })

            localStorage.setItem(dPlayer.id, JSON.stringify(dPlayer));

            client.message(`@${player.id} sold: ${final.join(", ")}. +${total}$#.`)
        }
        if(command == "pfish") {
            //client.message("FISIN....")

            setTimeout(() => {
            
            })
        }
        if(command == "pmine") {
            client.message("now we back in the mine")
        }
        if(command == "??farm") {
            client.message("please use pfarm")
        }
        if(command == "pinv") {
            client.message(`@${player.id} has ${dPlayer.items.map(e => e.name + " ("+e.cost+"$#) x" + e.amount).join(", ")}`)
        }

        if(command == "psell") {
            const all = args.join(" ")
            const itemRegex = /\[([^[\]]*) x(\d*)\]/gm;
            let match = itemRegex.exec(all);
            let found;
            const final: [string, number][] = [];

            while (match != null) {

                const item = dPlayer.items.find(e => e.name == match![1]);

                if(item) {
                    const count = +match[2];

                    if(isNaN(count)) return;

                    found = true;

                    if(item.amount < count) {
                        client.message(`@${player.id}, you cannot sell more than ${item.amount} of ${item.name}.`);
                        return;
                    }
                    if(count < 1) {
                        client.message(`@${player.id}, you cannot sell less than 1 of ${item.name}.`);
                        return;
                    }

                    dPlayer.money += count*item.cost;
                    item.amount -= count;
                    
                    if(item.amount == 0) {
                        dPlayer.items = dPlayer.items.filter(e => e.name !== item.name);
                    }

                    final.push([`${count} x${item.name}`, count*item.cost]);
                    
                    localStorage.setItem(dPlayer.id, JSON.stringify(dPlayer));
                } 

                console.log(match)
                match = itemRegex.exec(all);
            
            }

            if(!found) {
                client.message("Example: psell [anonyiron x3] [basketball x1]")
            } else {
                client.message(`Sold: ${final.map(e => e[0]).join(", ")}. Total: ${final.map(e => e[1]).reduce((a, b) => a + b)}`)
            }
        }
        if(command == "pfarm") {

            if(dPlayer.timeouts.includes("farm")) {
                client.message(`@${player.id} can't farrrmmmm, twooo placess.. at the same.. time...`)
                return;
            } else {
                dPlayer.timeouts.push("farm");
                localStorage.setItem(dPlayer.id, JSON.stringify(dPlayer));
            }

            const shuffledItems: {
                name: string;
                cost: number;
                garbage: boolean;
            }[] = fyShuffle(FarmItems).slice(0, Math.floor(Math.random() * 5)+1)
            
            client.message(`@${player.id} Started farming.`)
            setTimeout(() => {
                client.message(`@${player.id} Finished farming. Got: ` + shuffledItems.map(e => { return `${e.name} (${e.cost}$#)`}).join(", "))

                shuffledItems.forEach(e => {
                    const item = dPlayer.items.find(b => b.name == e.name);
                    if(item) {
                        item.amount += 1;
                    } else {
                        dPlayer.items.push({...e, amount: 1})
                    }
                })

                dPlayer.timeouts = dPlayer.timeouts.filter(e => e !== "farm")
                localStorage.setItem(dPlayer.id, JSON.stringify(dPlayer));
            }, Math.random() * 30000)
        }

        if(command == "phelp") {
            client.message(`@${player.id} Available commands: pfarm, pbasketball, psell, pinv, pbal, pkickban (Not done), pcrown (Not done), pmine (Not done), pfish (Not done)`)
        }
    })
}

config.servers.forEach(server => {
    new Multiclient(mClient).connect(server.url, server.token, server.rooms);
})
