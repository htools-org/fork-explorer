import React from "react";

interface Config {
  apiBaseUrl: string | undefined;

  // Whether to load real data or fake
  mode: "real" | "fake" | "fake-frontend";

  // Configuration related to the API server
  server: {
    // The server host or listening IP
    host: string;
    // The server listening port
    port: number;
  };

  // Configuration for bitcoind's JSON-RPC server
  bitcoinRpc: {
    // Server host IP or domain.
    server: string;
    // Username credentials.
    user: string;
    // Password credentials.
    password: string;
  };

  minerWindow: number;

  // Information about the softfork in question should be added here.
  // Things inside here will most likely be used and shown on the webpage.
  fork: {
    // The common name of this softfork.
    name: string;
    // The code name of this softfork.
    codename: string;
    // Information about this softfork, each array item is rendered as a paragraph.
    info: string[];
    // The BIP9 version bit as defined in the softfork's BIP.
    versionBit: number;
    // Threshold for the softfork to be locked in
    threshold: number;
    // Status of the softfork
    status: "defined" | "started" | "locked_in" | "active";
    // Block height the softfork gets activated.
    activationHeight: number;
    // Show a countdown timer until the softfork is activated.
    // Only available when the `status` is `locked_in`.
    showActivationCountdown: boolean;
    // Show celebration confetti on the site.
    showCelebrationConfetti: boolean;
  };

  // Configuration specifically for the frontend site
  frontend: {
    // How often to auto-refresh, in seconds. Set to null to disable
    autoRefreshInterval: number | null;
    // Twitter handle, this is for the Twitter link preview
    twitterHandle: string;
    // Celebratory video to display once lock-in is reached
    celebrate?: {
      type: string;
      url: string;
    };
    // Content related to the About page
    about?: {
      // Information about the softfork, it's allowed to use
      // React components here.
      // Use the Online Babel JSX Transpiler to create React components: https://babeljs.io/repl
      softfork?: {
        info?: React.ReactNode[];
      };
      // Information related to the current deployment method being
      // used for this softfork (i.e BIP9, Speedy Trial etc)
      method?: {
        title: React.ReactNode;
        info: React.ReactNode[];
      };
    };
    // Sponsors of this project
    sponsors?: {
      title: string;
      url: string;
      imageUri: string;
    }[];
  };
}

// SOFT FORKS

const network: "mainnet" | "regtest" = "mainnet";

type SoftFork = { fork: Config["fork"]; about: Config["frontend"]["about"] };

const icannLockup = {
  fork: {
    name: "ICANN Lockup",
    codename: "icannlockup",
    info: [],
    versionBit: 1,
    threshold: network === "mainnet" ? 1916 : 108,
    status: "defined",
    activationHeight: 1,
    showActivationCountdown: true,
    showCelebrationConfetti: true,
  },

  about: {
    softfork: {
      info: [
        React.createElement(
          React.Fragment,
          null,
          "Currently, after ~4 years from mainnet genesis (block 210240), all unclaimed \
            reserved names will be allowed to go up for auction. This soft fork prevents \
            auctions for some of these names for another 4 years (till block 419328)."
        ),
        React.createElement(
          "div",
          { className: "info-links" },
          "For more info: ",
          React.createElement(
            "a",
            { href: "https://github.com/handshake-org/hsd/pull/819", target: "_blank" },
            "Initial PR"
          ),
          React.createElement(
            "a",
            { href: "https://github.com/handshake-org/hsd/pull/828", target: "_blank" },
            "10k PR"
          ),
          React.createElement(
            "a",
            { href: "https://github.com/handshake-org/hsd/pull/834", target: "_blank" },
            "Timeline PR"
          )
        ),
      ],
    },
    method: {
      title: "Details",
      info: [
        React.createElement(
          React.Fragment,
          null,
          React.createElement(
            "ul",
            null,
            React.createElement(
              "li",
              null,
              "The reserved names are sorted by new Alexa rankings and the top 10k are reserved for another 4 years (~Feb 2028)."
            ),
            React.createElement("li", null, "ICANN TLDs remain locked permanantly."),
            React.createElement(
              "li",
              null,
              "While this soft fork only prevents auctions, a future hard fork will re-enable claiming."
            ),
            React.createElement(
              "li",
              null,
              "The rest of the 100k reserved names are not affected and can be opened for auction after the reserved period ends (~Feb 2024)."
            ),
            React.createElement(
              "li",
              null,
              "BIP-9 signalling by miners takes place from 10th August 2023 to 31th December 2023."
            ),
            React.createElement(
              "li",
              null,
              "95% of the blocks in a 2 week period (2016 blocks) must signal for the soft fork to activate."
            )
          )
        ),
      ],
    },
  },
} satisfies SoftFork;

const airstop = {
  fork: {
    name: "Airstop",
    codename: "airstop",
    info: ["End Airdorp Claims"],
    versionBit: 2,
    threshold: network === "mainnet" ? 1916 : 108,
    status: "defined",
    activationHeight: 1,
    showActivationCountdown: true,
    showCelebrationConfetti: true,
  },

  about: {
    softfork: {
      info: [
        React.createElement(
          React.Fragment,
          null,
          "Handshake airdops have been open to claim since mainnet launch in Feb 2020. This soft fork ends the airdrop claims."
        ),
        React.createElement(
          "div",
          { className: "info-links" },
          "For more info: ",
          React.createElement(
            "a",
            { href: "https://github.com/handshake-org/hsd/pull/927", target: "_blank" },
            "GitHub PR"
          ),
          React.createElement("a", { href: "https://shakeshift.com/stats", target: "_blank" }, "ShakeShift Statistics"),
          React.createElement(
            "a",
            { href: "https://learn.namebase.io/about-handshake/handshake-coin", target: "_blank" },
            "Namebase HNS Coin Economics"
          )
        ),
      ],
    },
    method: {
      title: "Details",
      info: [
        React.createElement(
          React.Fragment,
          null,
          React.createElement(
            "ul",
            { className: "details-list" },
            React.createElement(
              "li",
              null,
              "Handshake has had an airdrop open since Feb 2020 for open source contributors and developers, which consitutes a majority of the total supply. As of July 2025:",
              React.createElement(
                "ul",
                null,
                React.createElement("li", null, "7,906 have been claimed of 217,557 total (that's 3.6%)"),
                React.createElement("li", null, "209,651 are unclaimed (890,386,604.924414 HNS)"),
                React.createElement("li", null, "1 claim this year")
              )
            ),
            React.createElement(
              "li",
              null,
              "Claims of these airdrops has steadily decreased over time. One of the main reasons for this is that the claim requires recipients to still control their SSH/PGP key from 2020 that was included in the snapshot. This is a problem for many developers who have either lost access to or rotated their keys."
            ),
            React.createElement(
              "li",
              null,
              "After this soft fork activates, airdrop claims will no longer be possible."
            ),
            React.createElement(
              "li",
              null,
              'All unclaimed airdrops will be removed from supply (they were never in "circulation" to begin with)'
            ),
            React.createElement(
              "li",
              null,
              "For more detailed numbers, check out cymon's amazing tracker: ",
              React.createElement(
                "a",
                {
                  href: "https://shakeshift.com/stats",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  style: { color: "unset" },
                },
                "https://shakeshift.com/stats"
              )
            ),
            React.createElement(
              "li",
              null,
              "BIP-9 signalling by miners takes place from 10th August 2023 to 31th December 2023."
            ),
            React.createElement(
              "li",
              null,
              "95% of the blocks in a 2 week period (2016 blocks) must signal for the soft fork to activate."
            )
          )
        ),
      ],
    },
  },
} satisfies SoftFork;

// const selectedSoftFork: SoftFork = icannLockup;
const selectedSoftFork: SoftFork = airstop;

const config: Config = {
  apiBaseUrl: "http://localhost:8080/api",

  mode: "real",

  server: {
    host: "127.0.0.1",
    port: 8080,
  },

  bitcoinRpc: {
    server: network === "mainnet" ? "http://127.0.0.1:12037" : "http://127.0.0.1:14037",
    user: "",
    password: "apikey",
  },

  minerWindow: network === "mainnet" ? 2016 : 144,

  fork: selectedSoftFork.fork,

  frontend: {
    autoRefreshInterval: 5,
    twitterHandle: "",
    // celebrate?: {
    //   type: "video";
    //   url: "path";
    // };
    about: selectedSoftFork.about,
    sponsors: [],
  },
};

export default config;
