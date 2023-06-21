export interface IBlock {
  height: number;
  signals: boolean | undefined;
  miner: string | undefined;
  minerWebsite: string | undefined;
}

export interface IMinerData {
  name: string;
  signals: boolean;
  website: string | undefined;
  numBlocks: number;
  numSignallingBlocks: number;
}

export interface IMiners {
  [key: string]: IMinerData;
}

export interface IBlockchainInfo {
  blocks: number;
  softforks: {
    [name: string]: {
      status: string;
      bit: number;
      startTime: number;
      timeout: number;
      statistics: {
        period: number;
        threshold: number;
        elapsed: number;
        count: number;
        possible: boolean;
      };
    };
  };
}
