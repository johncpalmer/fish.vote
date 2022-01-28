import React, { useState, useCallback, useEffect, useRef } from 'react'
import numeral from 'numeral';

import vechain from "@state/vechain";
import governance from "@state/governance";

import useOutsideAlerter from '../../hooks/useOutsideAlerter'
import { truncateAddress, copyTextToClipboard, userAccount } from '../../utils'

import ButtonArrow from '../ButtonArrow'
import Indicator from '../Indicator'
import { VEX_NETWORK } from "@utils/constants";

import {
  AccountStatusContainer,
  MenuItem,
  MenuItemText,
  WalletButton,
  WalletButtonText,
  WalletContainer,
  WalletCopyIcon,
  WalletDesktopMenu,
  Wrapper,
  VotesDescription,
} from './styled'

function AccountStatus({ variant }) {
  const { vex, currentVotes } = governance.useContainer();
  const { address, unlock } = vechain.useContainer();
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [copyState, setCopyState] = useState('hidden')

  // Track clicked area outside of desktop menu
  const desktopMenuRef = useRef(null)
  useOutsideAlerter(desktopMenuRef, () => {
    if (variant === 'desktop' && isMenuOpen) onCloseMenu()
  })


  useEffect(() => {
    let timer

    switch (copyState) {
      case 'visible':
        timer = setTimeout(() => {
          setCopyState('hiding')
        }, 800)
        break
      case 'hiding':
        timer = setTimeout(() => {
          setCopyState('hidden')
        }, 200)
    }

    if (timer) clearTimeout(timer)
  }, [copyState])

  const handleCopyAddress = useCallback(() => {
    if (address) {
      copyTextToClipboard(address)
      setCopyState('visible')
    }
  }, [address])

  const onToggleMenu = useCallback(() => {
    setIsMenuOpen((open) => !open)
  }, [])

  const onCloseMenu = useCallback(() => {
    setIsMenuOpen(false)
  }, [])

  const handleButtonClick = useCallback(async () => {
    if (address) {
      onToggleMenu()
      return
    }

    unlock()
  }, [address, onToggleMenu, unlock])

  const handleOpenExplore = useCallback(() => {
    if (address) {
      window.open(`${VEX_NETWORK.explorer_base_url}accounts/${address}`)
    }
  }, [address])

  const renderButtonContent = () =>
    address ? (
      <>
        <Indicator connected={address} />
        <WalletButtonText connected={address}>
          {truncateAddress(address)} <ButtonArrow isOpen={isMenuOpen}/>
        </WalletButtonText>
      </>
    ) : (
      <WalletButtonText connected={address}>Connect Wallet</WalletButtonText>
    )

  const renderMenuItem = (title, onClick, extra) => {
    return (
      <MenuItem onClick={onClick} role='button'>
        <MenuItemText>{title}</MenuItemText>
        {extra}
      </MenuItem>
    )
  }

  const getUserVexAmount = () => {
    return vex !== null ? `${numeral(vex).format('0,0')} VEX` : 'LOADING...';
  };

  const renderCopiedButton = () => {
    return <WalletCopyIcon className="far fa-clone" state={copyState}/>
  }

  return (
    <Wrapper>

      { address ? (
        <VotesDescription>
          You have
          &nbsp;
          <span>{numeral(currentVotes).format('0,0')} votes</span>
          &nbsp;
          and
          &nbsp;
          <span>{getUserVexAmount()}</span>
        </VotesDescription>
      ) : null}


      <AccountStatusContainer variant={variant}>
        <WalletContainer variant={variant} ref={desktopMenuRef}>
          <WalletButton variant={variant} onClick={handleButtonClick}>
            {renderButtonContent()}
          </WalletButton>
          <WalletDesktopMenu isMenuOpen={isMenuOpen}>
            kenneth
            {renderMenuItem('DISCONNECT WALLET', () => { userAccount.remove() })}
            {renderMenuItem(
                copyState === 'hidden' ? 'Copy Address' : 'Address Copied',
                handleCopyAddress,
                renderCopiedButton()
            )}
            {renderMenuItem('Open in explorer', handleOpenExplore)}
          </WalletDesktopMenu>
        </WalletContainer>

      </AccountStatusContainer>
    </Wrapper>
  )
}

export default AccountStatus
