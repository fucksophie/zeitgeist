import { Client, Player } from "../../classes/Client.ts";
import { DatabaseRoom, getDPlayer, getDRoom } from "../../classes/Database.ts";

function rgbToHex(r: number, g: number, b: number) {
  return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255, g /= 255, b /= 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return { "h": h, "s": s, "l": l };
}

function rainbow(len: number, type: string, pastel: boolean) {
  let eq1 = 127;
  let eq2 = 128;
  if (len == undefined) len = 24;
  if (type == undefined) type = "rgb";
  if (pastel == true) {
    eq1 = 55;
    eq2 = 200;
  }
  const frequency = Math.PI * 2 / len;

  const cvparr = [];
  for (let i = 0; i < len; ++i) {
    const red = Math.sin(frequency * i + 2) * eq1 + eq2;
    const green = Math.sin(frequency * i + 0) * eq1 + eq2;
    const blue = Math.sin(frequency * i + 4) * eq1 + eq2;

    switch (type) {
      case "hex":
        cvparr.push({
          "hex": rgbToHex(Math.round(red), Math.round(green), Math.round(blue)),
        });
        break;
      case "rgb":
        cvparr.push({ "r": red, "g": green, "b": blue });
        break;
      case "hsl":
        cvparr.push(
          rgbToHsl(Math.round(red), Math.round(green), Math.round(blue)),
        );
        break;
    }
  }
  return cvparr;
}

interface RainbowInterval {
  interval: number;
  current: number;
}

const rainbowIntervals: Map<string, RainbowInterval> = new Map<
  string,
  RainbowInterval
>();

const colors = rainbow(20, "hex", false);

export default function (player: Player, client: Client) {
  const dPlayer = getDPlayer(client, player);

  const dRoom: DatabaseRoom = getDRoom(client)!;

  if (
    dRoom.ranks.get(player.id) == "room-owner" || dPlayer.rank == "bot-owner"
  ) {
    if (rainbowIntervals.get(client.wsUrl + client.channel)) {
      clearInterval(
        rainbowIntervals.get(client.wsUrl + client.channel)?.interval,
      );

      rainbowIntervals.delete(client.wsUrl + client.channel);
      client.message("Stopped.");
      client.channelset({
        color: "#000000",
        color2: "#000000",
      });
    } else {
      rainbowIntervals.set(
        client.wsUrl + client.channel,
        {
          current: 0,
          interval: setInterval(() => {
            const current = rainbowIntervals.get(
              client.wsUrl + client.channel,
            )!;

            if (current.current == colors.length - 1) {
              current.current = 0;
              rainbowIntervals.set(client.wsUrl + client.channel, current);
            }

            client.channelset({
              color: "#" +
                (colors[current.current + 1] as unknown as Record<
                  string,
                  string
                >).hex,
              color2: "#" +
                (colors[current.current] as unknown as Record<string, string>)
                  .hex,
            });

            current.current++;
            rainbowIntervals.set(client.wsUrl + client.channel, current);
          }, 1000),
        },
      );

      client.message("WEEEEEEEEEEEE!!!");
    }
  } else {
    client.message("You do not have permission!");
  }
}
