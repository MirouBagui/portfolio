import Link from 'next/link';
import React from 'react';
import { AiFillGithub, AiFillLinkedin ,AiOutlineCodepen} from 'react-icons/ai';
import { DiCssdeck } from 'react-icons/di';

import { Container, Div1, Div2, Div3, NavLink, SocialIcons } from './HeaderStyles';

const Header = () =>  (
  <Container>
    <Div1 tabIndex="0">
      <Link href="/">
        <>
          <DiCssdeck size="3rem" tabIndex="0"/> <span tabIndex="0">Portfolio</span>
        </>
      </Link>
    </Div1>
    <Div2>
      <li tabIndex="0"  >
        <Link href="#projects" >
          <NavLink >Projects</NavLink>
        </Link>
      </li>
      <li tabIndex="0">
        <Link href="#tech">
          <NavLink >Technologies</NavLink>
        </Link>
      </li>        
      <li tabIndex="0">
        <Link href="#about">
          <NavLink>About</NavLink>
        </Link>
      </li>        
    </Div2>
      <Div3>
        <SocialIcons href="https://github.com/miroubagui/">
          <AiFillGithub size="3rem" />
        </SocialIcons>
        <SocialIcons href="https://www.linkedin.com/in/amir-saoudi05/">
          <AiFillLinkedin size="3rem" />
        </SocialIcons>
        <SocialIcons href="https://codepen.io/miroubagui">
          <AiOutlineCodepen size="3rem"/>
        </SocialIcons>
      </Div3>
    </Container>
);

export default Header;
