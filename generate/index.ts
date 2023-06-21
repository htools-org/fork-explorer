import { setupPeriod } from "../backend/blocks/index.ts";
import config from "../src/config/config.ts";

const periodString = Deno.args[0];

if (!periodString) {
  console.log("Usage: [period]");
  Deno.exit(0);
}

const period = Number.parseInt(periodString);

if (Number.isNaN(period)) {
  console.log("Error: Invalid period: " + periodString + " (evaluated as " + period + ")");
  Deno.exit(1);
}

const difficultyPeriodStartHeight = period * config.minerWindow;
const difficultyPeriodEndHeight = difficultyPeriodStartHeight + config.minerWindow;

const blocks = await setupPeriod(
  period * config.minerWindow + config.minerWindow,
  difficultyPeriodStartHeight,
  difficultyPeriodEndHeight
);
await Deno.writeTextFile(Deno.cwd() + `/data/periods/${period}.json`, JSON.stringify(blocks));
