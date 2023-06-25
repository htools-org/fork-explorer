import React from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";

import config from "../config/config.ts";

import { Container } from "../components/Container.ts";
import { Content } from "../components/Content.ts";
import SiteTitle from "../components/SiteTitle.tsx";
import SiteMenu from "../components/SiteMenu.tsx";
import Text from "../components/Text.tsx";
import ContactTwitter from "../components/ContactTwitter.tsx";
import CommonHeader from "../components/CommonHeader.ts";
import Body from "../components/Body.ts";

const Header = styled(CommonHeader)`
  font-size: 24px;
  margin-bottom: 10px;
  font-weight: normal;
`;

const InfoContainer = styled.div`
  max-width: 980px;
  line-height: 1.5rem;
`;

const InfoSection = styled.div``;

const SponsorContainer = styled.div`
  max-width: 980px;
`;

const SponsorSection = styled.div`
  display: flex;
  flex-direction: row;
`;

const Sponsor = styled.a`
  display: flex;
  flex-direction: column;
  width: 175px;
  align-items: center;
  margin: 10px 10px;
  padding: 8px;
  text-decoration: none;
`;

const SponsorImage = styled.img`
  max-width: 120px;
`;

const SponsorName = styled.p`
  color: #f7f7f7;
  font-size: 14px;
  margin-bottom: 0;
`;

export default function Blocks() {
  const forkName = config.fork.name;

  return (
    <Container>
      <Helmet>
        <title>{config.fork.name} Activation - About</title>
      </Helmet>
      <Content>
        <SiteTitle />
        <SiteMenu />
        <Body>
          <InfoContainer>
            <InfoSection>
              <Header>Information about the softfork</Header>
              {config.frontend.about?.softfork?.info?.map((section, i) => (
                <Text key={i}>{section}</Text>
              ))}
            </InfoSection>
            <InfoSection>
              <Header>{config.frontend.about?.method?.title}</Header>
              {config.frontend.about?.method?.info?.map((section, i) => (
                <Text key={i}>{section}</Text>
              ))}
            </InfoSection>
            <InfoSection>
              <Header>About this site</Header>
              <Text>
                This website tracks soft forks for the{" "}
                <a href="https://handshake.org" target="_blank" rel="noopener noreferrer">
                  Handshake
                </a>{" "}
                blockchain. It is based on{" "}
                <a href="https://github.com/hsjoberg/fork-explorer" target="_blank" rel="noopener noreferrer">
                  fork-explorer
                </a>
                , created for Bitcoin.
              </Text>
            </InfoSection>
          </InfoContainer>
          {config.frontend.sponsors?.length! > 0 && (
            <SponsorContainer>
              <Header>Development Patrons</Header>
              {config.frontend.sponsors?.map((sponsor) => (
                <SponsorSection key={sponsor.title}>
                  <Sponsor href={sponsor.url} target="_blank">
                    <SponsorImage src={sponsor.imageUri} />
                    <SponsorName>{sponsor.title}</SponsorName>
                  </Sponsor>
                </SponsorSection>
              ))}
            </SponsorContainer>
          )}
        </Body>
        {config.frontend.twitterHandle && <ContactTwitter />}
      </Content>
    </Container>
  );
}
