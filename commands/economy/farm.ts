import { Client, Player } from "../../classes/Client.ts";
import { getDPlayer, setDPlayer } from "../../classes/Database.ts";

// deno-lint-ignore no-explicit-any
function fyShuffle(arr: any[]) {
  let i = arr.length;
  while (--i > 0) {
    const randIndex = Math.floor(Math.random() * (i + 1));
    [arr[randIndex], arr[i]] = [arr[i], arr[randIndex]];
  }
  return arr;
}

const FarmItems = [
  { name: "ballsac", cost: 69, garbage: true },
  { name: "among us apple", cost: 111, garbage: true },
  { name: "singular egg", cost: 10, garbage: true },
  { name: "anony rabbit", cost: 50, garbage: true },
  { name: "AMONG US TOES", cost: 100, garbage: true },
  { name: "ak47", cost: 420, garbage: true },
  { name: "among us toes 2 new version", cost: 11, garbage: true },
  { name: "hackapple", cost: 12 },
  { name: "grantfruit", cost: 1, garbage: true },
  { name: "Lapis Lazuli", cost: 92, garbage: true },
  { name: "grantfruit", cost: 12, garbage: true },
  { name: "anonywood", cost: 2, garbage: true },
  { name: "anonyiron", cost: 20, garbage: true },
  { name: "basketball", cost: 500 },
  { name: "anonydiamond", cost: 10, garbage: true },
  { name: "anonygold", cost: 20, garbage: true },
  { name: "soda", cost: 2, garbage: true },
  { name: "OBAMNA", cost: 7, garbage: true },
];

export default async function (player: Player, client: Client) {
  const dPlayer = await getDPlayer(client, player);let time = Math.random() * 30000;
  let found = dPlayer.timeouts.find(x => x.startsWith("farm-"));

  if (found) {
    if((+found.split("-")![1]!) > Date.now()) {
      client.message(
        `@${player.id} can't farrrmmmm, twooo placess.. at the same.. time...`,
      );
      return;
    } else {
      dPlayer.timeouts = dPlayer.timeouts.filter(x => !x.startsWith("farm-"));
      found = undefined;
      time = 0;
    }
  }

  if(!found) {
    dPlayer.timeouts.push("farm-" + (Date.now() + time));

    await setDPlayer(dPlayer);
  }

  const shuffledItems: {
    name: string;
    cost: number;
    garbage: boolean;
  }[] = fyShuffle(FarmItems).slice(0, Math.floor(Math.random() * 5) + 1);

  if(time !== 0) client.message(`@${player.id} Started farming.`);
  setTimeout(async () => {
    client.message(
      `@${player.id} Finished farming. Got: ` + shuffledItems.map((e) => {
        return `${e.name} (${e.cost}$#)`;
      }).join(", "),
    );

    shuffledItems.forEach((e) => {
      const item = dPlayer.items.find((b) => b.name == e.name);
      if (item) {
        item.amount += 1;
      } else {
        dPlayer.items.push({ ...e, amount: 1 });
      }
    });

    dPlayer.timeouts = dPlayer.timeouts.filter(x => !x.startsWith("farm-"));
    await setDPlayer(dPlayer);
  }, time);
}
