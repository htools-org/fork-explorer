import React, { useEffect } from "react";
import styled from "styled-components";
import confetti from "canvas-confetti";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";

import CommonHeader from "./CommonHeader.ts";
import { useStoreState } from "../state/index.ts";
import config from "../config/config.ts";
import { computeStats } from "../common/data.ts";
import { IBlockchainInfo } from "../common/interfaces.ts";

dayjs.extend(relativeTime);

const StatusContainer = styled.div`
  margin: auto;
  margin-bottom: 70px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 900px;
`;

const StatusText = styled(CommonHeader)`
  font-size: 44px;
  text-align: center;
  margin-bottom: 2px;
`;

const StatusDescription = styled(CommonHeader)`
  text-align: center;
`;

const Video = styled.video`
  display: block;
  max-width: 100%;
  margin: 12px 0;
`;

const CountdownHeader = styled(CommonHeader)`
  font-size: 28px;
  text-align: center;
  margin-bottom: 0;
  text-transform: uppercase;
`;

const Countdown = styled(CommonHeader)`
  font-size: 58px;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${(props) => props.theme.activationCountdown.countdownTimeColor};
  text-transform: uppercase;
`;

const CountdownBlocks = styled(CommonHeader)`
  font-size: 18px;
  text-align: center;
  margin-bottom: 50px;
  text-transform: uppercase;
`;

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function showConfetti() {
  const duration = 4 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 60 * (timeLeft / duration);
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.35), y: Math.random() - 0.2 } });
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.65, 0.9), y: Math.random() - 0.2 } });
  }, 250);
}

export default function LockedIn() {
  const blocks = useStoreState((store) => store.blocks);
  const blockchainInfo: IBlockchainInfo = useStoreState((store) => store.blockchainInfo);
  const forkName = config.fork.name;

  const status = blockchainInfo.softforks[config.fork.codename]?.status || config.fork.status;
  const { lockedIn } = computeStats(blocks);

  const blocksToActive =
    (status === "locked_in" ? 0 : 1) * config.minerWindow +
      (config.minerWindow - (blockchainInfo.blocks % config.minerWindow)) -
      1 || config.minerWindow;

  useEffect(() => {
    if (config.fork.showCelebrationConfetti) {
      showConfetti();
    }
  }, []);

  const showActivationCountdown = config.fork.showActivationCountdown && status !== "active";

  return (
    <StatusContainer>
      {!showActivationCountdown && (
        <>
          <StatusText>
            {(status === "locked_in" || (lockedIn && status !== "active")) && <>LOCKED IN!</>}
            {status === "active" && <>ACTIVE!</>}
          </StatusText>
          <StatusDescription>
            {lockedIn && status === "started" && (
              <>
                This period has reached {config.fork.threshold} {forkName} signalling blocks, which is required for
                lock-in.
              </>
            )}
            {status === "locked_in" && <>{forkName} has been locked in!</>}
            {status === "active" && <>{forkName} softfork has been activated!</>}
          </StatusDescription>
        </>
      )}
      {showActivationCountdown && (
        <>
          <CountdownHeader>
            {config.fork.name}
            {status === "locked_in" ? " is locked in and " : " "}
            activates in
          </CountdownHeader>
          <Countdown>
            {dayjs()
              .add(blocksToActive * 10, "minutes")
              .fromNow()}
          </Countdown>
          <CountdownBlocks>{blocksToActive} blocks left</CountdownBlocks>
        </>
      )}
      {config.frontend.celebrate && <Video src={config.frontend.celebrate.url} controls />}
    </StatusContainer>
  );
}
