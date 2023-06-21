import { action, Action, createStore, createTypedHooks, thunk, Thunk } from "easy-peasy";

import config from "../config/config.ts";
import { IBlock, IBlockchainInfo } from "../common/interfaces.ts";
import { createFakeBlock } from "../common/fake-block.ts";
import { ISettingsModel, settings } from "./settings.ts";

type MonitoringMode = "current_period" | "historic_period";

export interface IStoreModel {
  initialize: Thunk<IStoreModel>;

  setMonitoringMode: Action<IStoreModel, MonitoringMode>;

  getBlocks: Thunk<IStoreModel>;
  setBlocks: Action<IStoreModel, IBlock[]>;

  getBlockchainInfo: Thunk<IStoreModel>;
  setBlockchainInfo: Action<IStoreModel, IBlockchainInfo[]>;

  getPeriod: Thunk<IStoreModel, number>;

  setActivePeriod: Action<IStoreModel, number | null>;
  setAvailablePeriods: Action<IStoreModel, number[]>;

  changeMonitoringPeriod: Thunk<IStoreModel, number | "current">;
  autoRefresh: Thunk<IStoreModel>;

  blocks: IBlock[];
  blockchainInfo: IBlockchainInfo;
  availablePeriods: number[];
  activePeriod: number | null;
  monitoringMode: MonitoringMode;

  settings: ISettingsModel;
}

export const model: IStoreModel = {
  initialize: thunk(async (actions) => {
    await actions.settings.initialize();
    if (config.mode !== "fake-frontend") {
      actions.getBlockchainInfo();
      const periodsResult = await fetch("/periods");
      const periods: number[] = await periodsResult.json();
      actions.setAvailablePeriods(periods);
    }
  }),

  setMonitoringMode: action((state, payload) => {
    state.monitoringMode = payload;
  }),

  getBlocks: thunk(async (actions) => {
    if (config.mode === "real" || config.mode === "fake") {
      const result = await fetch(`/blocks`);
      const json = (await result.json()) as IBlock[];
      console.log(json);
      actions.setBlocks(json);
    } else {
      const start = 100000;
      const end = 101016;
      const blocks: IBlock[] = [];
      for (let i = start; i < 102016; i++) {
        if (i < end) {
          blocks.push(await createFakeBlock(i));
        } else {
          blocks.push({
            height: i,
            signals: undefined,
            miner: undefined,
            minerWebsite: undefined,
          });
        }
      }
      actions.setBlocks(blocks);
    }
  }),

  getPeriod: thunk(async (actions, payload) => {
    if (config.mode === "real" || config.mode === "fake") {
      const result = await fetch(`/period/${payload}`);
      const json = (await result.json()) as IBlock[];
      actions.setBlocks(json);
    } else {
      console.log("WARNING: getPeriod for mode fake-frontend unimplemented!");
    }
  }),

  getBlockchainInfo: thunk(async (actions, payload) => {
    if (config.mode === "real" || config.mode === "fake") {
      const result = await fetch("/getblockchaininfo");
      const json = (await result.json()) as IBlockchainInfo;
      console.log("getblockchaininfo", json);
      if (!json?.softforks) {
        console.log("Got bad response from /blockchaininfo, ignoring...");
        return;
      }
      actions.setBlockchainInfo(json);
    } else {
      console.log("WARNING: getPeriod for mode fake-frontend unimplemented!");
    }
  }),

  changeMonitoringPeriod: thunk(async (actions, period) => {
    if (period !== "current") {
      await actions.getPeriod(period);
      actions.setMonitoringMode("historic_period");
    } else {
      await actions.getBlocks();
      actions.setMonitoringMode("current_period");
    }

    actions.setActivePeriod(period === "current" ? null : period);
  }),

  autoRefresh: thunk((actions, _, { getState }) => {
    if (!config.frontend.autoRefreshInterval || getState().monitoringMode === "historic_period") {
      return;
    }

    setInterval(async () => {
      if (!getState().settings.autoRefreshEnabled || getState().monitoringMode === "historic_period") {
        return;
      }
      try {
        console.log("Fetching blocks");
        const result = await fetch("/blocks");
        const json = (await result.json()) as IBlock[];
        if (json && json.length === 0) {
          console.log("Got empty response from /blocks, ignoring...");
          return;
        }
        actions.setBlocks(json);
      } catch (error) {
        console.log("Couldn't fetch /blocks", error.message);
      }
      try {
        console.log("Fetching blockchaininfo");
        const result = await fetch("/getblockchaininfo");
        const json = (await result.json()) as IBlockchainInfo;
        console.log("getblockchaininfo", json);
        if (!json?.softforks) {
          console.log("Got bad response from /blockchaininfo, ignoring...");
          return;
        }
        actions.setBlockchainInfo(json);
      } catch (error) {
        console.log("Couldn't fetch /blockchaininfo", error.message);
      }
    }, config.frontend.autoRefreshInterval * 1000);
  }),

  setBlocks: action((state, payload) => {
    state.blocks = payload;
  }),

  setBlockchainInfo: action((state, payload) => {
    state.blockchainInfo = payload;
  }),

  setActivePeriod: action((state, payload) => {
    state.activePeriod = payload;
  }),

  setAvailablePeriods: action((state, payload) => {
    state.availablePeriods = payload;
  }),

  blocks: [],
  blockchainInfo: { softforks: {} },
  availablePeriods: [],
  activePeriod: null,
  monitoringMode: "current_period",

  settings,
};

const { useStoreActions, useStoreState } = createTypedHooks<IStoreModel>();
export { useStoreActions, useStoreState };

export default createStore(model);
