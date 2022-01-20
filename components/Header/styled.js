import styled from '@emotion/styled'

import { Title } from '../../design'
import theme from '../../design/theme'
import colors from '../../design/colors'
import sizes from '../../design/sizes'

export const HeaderButtonContainer = styled.div`
  display: flex;
  margin-right: 8px;
  z-index: 1;
`

export const HeaderAbsoluteContainer = styled.div`
  position: absolute;
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;

  @media (max-width: ${sizes.lg}px) {
    display: none;
  }
`

export const LinksContainer = styled.div`
  display: flex;
`

export const HeaderContainer = styled.div`
  height: ${theme.header.height}px;
  position: sticky;
  top: 0;
  border-bottom: 1px solid ${colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;

  @media (max-width: ${sizes.lg}px) {
    padding: 16px 24px;
    border-bottom: none;
  }

  z-index: ${props => (props.isMenuOpen ? 50 : 10)};

  // The backdrop for the menu does not show up if we enable the backdrop-filter
  // for the header nav. To get around that, just set 'none'
  ${props => {
    if (props.isMenuOpen) {
      return null
    }

    return `
      backdrop-filter: blur(40px);
      /**
       * Firefox desktop come with default flag to have backdrop-filter disabled
       * Firefox Android also currently has bug where backdrop-filter is not being applied
       * More info: https://bugzilla.mozilla.org/show_bug.cgi?id=1178765
       **/
      @-moz-document url-prefix() {
        background-color: rgba(0, 0, 0, 0.9);
      }
    `
  }}

  &:before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    background: rgba(255, 255, 255, 0.01);
  }
`

export const LogoContainer = styled.div`
  padding-left: 40px;
  display: flex;

  @media (max-width: ${sizes.md}px) {
    padding-left: 0;
  }
`

export const NavItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0px 28px;
  height: 100%;
  opacity: ${props => (props.isSelected ? '1' : '0.48')};

  &:hover {
    opacity: ${props => (props.isSelected ? theme.hover.opacity : '1')};
  }

  @media (max-width: ${sizes.lg}px) {
    padding: 0px 0px 40px 48px;
  }
`

export const SecondaryMobileNavItem = styled.div`
  display: none;

  @media (max-width: ${sizes.lg}px) {
    display: flex;
    padding: 0px 0px 24px 48px;
  }
`

export const NavLinkText = styled(Title)`
  letter-spacing: 1.5px;
  font-size: 14px;
  line-height: 20px;

  @media (max-width: ${sizes.lg}px) {
    font-size: 24px;
  }
`
