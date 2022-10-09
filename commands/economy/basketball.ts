import { Client, Player } from "../../classes/Client.ts";
import { DatabasePlayer, getDPlayer, setDPlayer } from "../../classes/Database.ts";


async function finish(client: Client, dPlayer: DatabasePlayer, player: Player) {
  const money = Math.floor(Math.random() * 100);

  client.message(
    `@${player.id}, finished ballin. Won NBA. Earned ${money}$#.`,
  );

  dPlayer.money += money;
  dPlayer.timeouts = dPlayer.timeouts.filter(x => !x.startsWith("balls-"));

  await setDPlayer(dPlayer);
}

export default async function (player: Player, client: Client) {
  const dPlayer = await getDPlayer(client, player);

  if (!dPlayer.items.find((e) => e.name == "basketball")) {
    client.message(`@${player.id} AYO WHERE YOUR BASKETBALL AT`);
    return;
  }

  const time = Math.random() * 30000;
  
  let found = dPlayer.timeouts.find(x => x.startsWith("balls-"));

  if (found) {
    if((+found.split("-")![1]!) > Date.now()) {
      client.message(`@${player.id} cant ball 2 balls at da same time??`);
      return;
    } else {
      dPlayer.timeouts = dPlayer.timeouts.filter(x => !x.startsWith("balls-"));
      found = undefined;

      await finish(client, dPlayer, player);
    }
  }

  if(!found) {
    dPlayer.timeouts.push("balls-" + (Date.now() + time));

    await setDPlayer(dPlayer);
  }

  client.message(
    `@${player.id} started ballin!! ${
      "ㅤ".repeat(Math.floor(Math.random() * 15))
    }•`,
  );

  setTimeout(async () => {
    await finish(client, dPlayer, player);
  }, time);
}
