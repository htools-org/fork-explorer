import { RouterMiddleware } from "https://deno.land/x/oak@v17.1.4/mod.ts";

import { getBlocks } from "../blocks/index.ts";

export const GetBlocks: RouterMiddleware<any, any, any> = (context) => {
  const blocks = getBlocks();
  context.response.body = blocks;
};
