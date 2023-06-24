import { getblockbyheight, getblockcount, getrawtransaction } from "../jsonrpc/index.ts";
import { IBlock } from "../../frontend/src/common/interfaces.ts";
import { hexToAscii } from "../../frontend/src/common/utils.ts";
import { createFakeBlock } from "../../frontend/src/common/fake-block.ts";
import config from "../../frontend/src/config/config.ts";
import miners from "../../frontend/src/common/miners.ts";

let blocks: IBlock[] = [];

async function createRealBlock(height: number): Promise<IBlock> {
  // const blockHash = await getblockhash(height);
  const block = await getblockbyheight(height);

  const generationTransactionTxId = block.tx[0];
  const generationTransaction = await getrawtransaction(generationTransactionTxId, block.hash);

  const payoutAddress = generationTransaction.vout[0]?.scriptPubKey?.addresses?.[0] ?? "";
  const coinbase = hexToAscii(generationTransaction.vin?.[0]?.txinwitness?.[0] ?? "");
  const minerData = (() => {
    for (const [addr, minerInfo] of Object.entries(miners.payout_addresses)) {
      if (payoutAddress == addr) {
        return minerInfo;
      }
    }

    for (const [tag, minerInfo] of Object.entries(miners.coinbase_tags)) {
      if (coinbase.includes(tag)) {
        return minerInfo;
      }
    }

    return undefined;
  })();

  return {
    miner: minerData?.name,
    minerWebsite: minerData?.link,
    height: block.height,
    signals: (block.version & (1 << config.fork.versionBit)) === 1 << config.fork.versionBit,
  };
}

export async function setupPeriod(blockCount: number, startHeight: number, endHeight: number): Promise<IBlock[]> {
  const createBlock = config.mode === "real" ? createRealBlock : createFakeBlock;

  const blocks: IBlock[] = [];
  for (let i = startHeight; i < endHeight; i++) {
    console.log(`Fetching: ${i}`);
    if (i > blockCount) {
      blocks.push({
        height: i,
        signals: undefined,
        miner: undefined,
        minerWebsite: undefined,
      });
      continue;
    }
    try {
      blocks.push(await createBlock(i));
    } catch (error) {
      console.error("Block boostrapping failed");
      throw error;
    }
  }

  return blocks;
}

export async function bootstrapBlocks() {
  console.log(`Bootstrapping ${config.mode} block data...`);
  const createBlock = config.mode === "real" ? createRealBlock : createFakeBlock;
  const callGetblockcount = config.mode === "real" ? getblockcount : async () => await Promise.resolve(1000);

  let blockCount = await callGetblockcount();
  const difficultyPeriodStartHeight = blockCount - (blockCount % config.minerWindow);
  const difficultyPeriodEndHeight = difficultyPeriodStartHeight + config.minerWindow;
  console.log(`Current block height is ${blockCount}`);
  blocks = await setupPeriod(blockCount, difficultyPeriodStartHeight, difficultyPeriodEndHeight);

  setInterval(async () => {
    const newBlockCount = await callGetblockcount();
    if (newBlockCount > blockCount) {
      console.log("Found new block");
      if (newBlockCount % config.minerWindow === 0) {
        blockCount = newBlockCount;
        const difficultyPeriodStartHeight = blockCount - (blockCount % config.minerWindow);
        const difficultyPeriodEndHeight = difficultyPeriodStartHeight + config.minerWindow;

        console.log(`Current block height is ${blockCount}`);
        blocks = await setupPeriod(blockCount, difficultyPeriodStartHeight, difficultyPeriodEndHeight);
        return;
      }

      for (let i = blockCount + 1; i <= newBlockCount; i++) {
        const block = await createBlock(i);
        blocks[i % config.minerWindow] = block;
        console.log(`Block ${i} set`);
      }
      blockCount = newBlockCount;
    }
  }, 10 * 1000);

  console.log("Bootstrapping done.");
}

export function getBlocks() {
  return blocks;
}
