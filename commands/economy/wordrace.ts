import { Client, Player } from "../../classes/Client.ts";
import { Words } from "../../classes/Data.ts";
import { getDPlayer, setDPlayer } from "../../classes/Database.ts";

interface WordraceTimeout {
  answer: string;
  wrong: number;
  time: number;
  server: string;
}

const timeouts: Map<string, WordraceTimeout> = new Map<
  string,
  WordraceTimeout
>();

async function listener(player: Player, message: string, client: Client) {
  const wordrace = timeouts.get(client.wsUrl);
  if (!wordrace) return;

  if (wordrace.answer !== message) {
    wordrace.wrong++;

    if (wordrace.wrong == 10) {
      wordrace.wrong = 0;
      wordrace.answer = "";
      client.message("Timed out.");
      client.off("message", listener);
      timeouts.delete(client.wsUrl);
      return;
    }
  } else {
    const dPlayer = await getDPlayer(client, player);

    const money = Math.floor(1 / (Date.now() - wordrace.time) * 200000);
    dPlayer.money += money;

    await setDPlayer(dPlayer);

    wordrace.wrong = 0;
    wordrace.answer = "";
    client.message(
      player.name + " got it right! Took you: " + (Date.now() - wordrace.time) +
        "ms. You got " + money + "#$.",
    );

    client.off("message", listener);
    timeouts.delete(client.wsUrl);
  }
}

export default function (_: Player, client: Client) {
  if (timeouts.get(client.wsUrl)) {
    client.message("Wordrace already running!");
    return;
  }

  timeouts.set(client.wsUrl, "lmfao" as unknown as WordraceTimeout);

  client.message("Please wait..");

  setTimeout(() => {
    timeouts.set(client.wsUrl, {
      answer: Words[Math.floor(Math.random() * Words.length)],
      wrong: 0,
      time: Date.now(),
      server: client.wsUrl,
    });

    client.message("NOW WRITE: [" + timeouts.get(client.wsUrl)!.answer + "]!");

    client.on("message", listener);
  }, 1000 + (Math.random() * 10000));
}
