import { Router } from "https://deno.land/x/oak@v17.1.4/mod.ts";

import { GetBlocks } from "./blocks.ts";
import { GetPeriod } from "./period.ts";
import { GetBlockchainInfo, GetBlockCount, GetBlockHash } from "./misc.ts";
import { GetPeriods } from "./periods.ts";

const router = new Router();

router.get("/api/blocks", GetBlocks);

router.get("/api/periods", GetPeriods);

router.get("/api/period/:period", GetPeriod);

router.get("/api/getblockchaininfo", GetBlockchainInfo);

router.get<any, { height: string }>("/api/getblockhash/:height", GetBlockHash);

router.get("/api/getblockcount", GetBlockCount);

export default router;
