import React, { useState } from 'react'
import Link from "next/link";
import AccountStatus from '../AccountStatus'
import Logo from '../Logo'

import { HeaderContainer, LogoContainer } from './styled.js';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <HeaderContainer
      isMenuOpen={isMenuOpen}
      className="d-flex align-items-center"
    >
      <Link href="/">
        <LogoContainer>
          <Logo />
        </LogoContainer>
      </Link>

      <AccountStatus variant="desktop" />
    </HeaderContainer>
  )
}

export default Header
