import React from 'react';
import { AiFillGithub, AiFillInstagram, AiFillLinkedin, AiOutlineCodepen } from 'react-icons/ai';

import { SocialIcons } from '../Header/HeaderStyles';
import { CompanyContainer, FooterWrapper, LinkColumn, LinkItem, LinkList, LinkTitle, Slogan, SocialContainer, SocialIconsContainer } from './FooterStyles';

const Footer = () => {
  return (
    <FooterWrapper>
      <LinkList>
        <LinkColumn>
          <LinkTitle>Phone</LinkTitle>
          <LinkItem href="tel:+33-622-64-29-85">+33.6.22.64.29.85</LinkItem>
        </LinkColumn>
        <LinkColumn>
          <LinkTitle>Email</LinkTitle>
          <LinkItem href="mailto:saoudi.amire@gmail.com">
          saoudi.amire@gmail.com
          </LinkItem>
        </LinkColumn>
      </LinkList>
      <SocialIconsContainer>
        <CompanyContainer>
          <Slogan>Let's create your next experience together</Slogan>
        </CompanyContainer>
        <SocialContainer>
          <SocialIcons href="https://github.com/miroubagui/">
            <AiFillGithub size="3rem" />
          </SocialIcons>
          <SocialIcons href="https://www.linkedin.com/in/amir-saoudi05/">
            <AiFillLinkedin size="3rem" />
          </SocialIcons>
          <SocialIcons href="https://codepen.io/miroubagui">
            <AiOutlineCodepen size="3rem" />
          </SocialIcons>
        </SocialContainer>
      </SocialIconsContainer>
    </FooterWrapper>
  );
};

export default Footer;
