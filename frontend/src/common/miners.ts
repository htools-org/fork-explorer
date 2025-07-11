export interface IMiners {
  coinbase_tags: {
    [key: string]: {
      name: string;
      link: string;
    };
  };
  payout_addresses: {
    [key: string]: {
      name: string;
      link: string;
    };
  };
}

// Copied from https://raw.githubusercontent.com/0xB10C/known-mining-pools/master/pools.json
const miners: IMiners = {
  coinbase_tags: {
    f2pool: {
      name: "F2Pool",
      link: "https://www.f2pool.com",
    },
    ViaBTC: {
      name: "ViaBTC",
      link: "https://www.viabtc.com",
    },
    // "mined by hsd": {
    //   name: "Mined by hsd (default)",
    //   link: "https://github.com/handshake-org/hsd",
    // },
  },
  payout_addresses: {
    hs1qqzlmrc6phwz2drwshstcr30vuhjacv5z0u2x9l: {
      name: "F2Pool",
      link: "https://www.f2pool.com",
    },
    hs1qnryzj7n8awq7cd398q5t2cs6vqd6yv525y2c4l: {
      name: "ViaBTC",
      link: "https://www.viabtc.com",
    },
    hs1q8vn02tnktq3tmztny8nysel6vtkuuy9k0whtty: {
      name: "DxPool",
      link: "https://www.dxpool.com",
    },
    hs1qme3cag8el3303lm7acvj5uppzc3fc9axes8k5y: {
      name: "ANTPOOL",
      link: "https://antpool.com",
    },
    hs1q6yghkpywfarhn4849h7tzfuthk9gupa2vsk8vr: {
      name: "Mining-DutchPools",
      link: "https://www.mining-dutch.nl/pools/handshake.php",
    },
    hs1qqymxtl5ul7ee99dpdcq79ss0993jekeu03jw8a: {
      // added on 2025-07-02
      name: "Mining-DutchPools",
      link: "https://www.mining-dutch.nl/pools/handshake.php",
    },
    hs1qu0x727w6guque3fzszpfameplp8hj8ur2tenty: {
      // added on 2025-07-11
      name: "Mining-DutchPools",
      link: "https://www.mining-dutch.nl/pools/handshake.php",
    },
    hs1q8vt20lqq5kd8nl9wsh9l5wh6xkqnchfl4sckr5: {
      // added on 2025-07-02
      name: "Cyberpool",
      link: "https://cyberpool.io/#hns",
    },
    hs1qxtya4m2kf62gplm2g60fv50y8z7d0dqezvhhyw: {
      // added on 2025-07-02
      name: "Cédric CRISPIN",
      link: "https://handshake.cedric-crispin.com",
    },
  },
};
export default miners;
