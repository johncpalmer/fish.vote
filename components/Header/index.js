
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import numeral from 'numeral';

import vechain from "@state/vechain";
import governance from "@state/governance";

import Address from "@components/Address";
import Button from '@components/Button'

import {
  Wrapper,
  Logo,
  Auth,
  AuthConnected,
} from './styled'

const Header = () => {
  const { vex, currentVotes } = governance.useContainer();
  const { address, unlock } = vechain.useContainer();

  // Connect wallet modal
  const [modalOpen, setModalOpen] = useState(false);
  const onOpenModal = () => setModalOpen(true);
  const onCloseModal = () => setModalOpen(false);

  /**
   * Returns VEX balance for authenticated user
   * @returns {String}
   */
  const returnVoteCount = () => {
    if (vex === 0) {
      return "0";
    }

    return vex ? `${numeral(vex).format('0,0')} VEX` : 'LOADING...';
  };

  const connectWalletWithLoading = async () => {
      await unlock();

      // Close modal after wallet connection, successful or not
      setModalOpen(false);
  };

  return (
    <Wrapper>
      <Logo>
        <Link href="/">
          <a
            style={{
              display: 'block' 
            }}
          >
            <Image
              src="/vectors/logo-mobile.svg"
              alt="Vexchange logo"
              width={40}
              height={40}
            />
          </a>
        </Link>
      </Logo>

      <Auth>
        {address ? (
          // Authenticated state
          <AuthConnected>
            <div>
              You have
              {" "}
              <span>{numeral(currentVotes).format('0,0')} votes</span>
              {" "}
              and
              {" "}
              <span>{returnVoteCount()}</span>
            </div>

            <Button onClick={unlock}>
              <Address shorten address={address} />
            </Button>
          </AuthConnected>
        ) : (
          <Button onClick={connectWalletWithLoading}>
            Connect wallet
          </Button>
        )}
      </Auth>
    </Wrapper>
  );
}

export default Header;