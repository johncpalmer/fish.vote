import React, { useState } from 'react'

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
      <LogoContainer>
        <Logo />
      </LogoContainer>

      <AccountStatus variant="desktop" />

    </HeaderContainer>
  )
}

export default Header
