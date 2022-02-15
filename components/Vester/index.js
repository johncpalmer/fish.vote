import React from "react";
import Button from "@components/Button";
import vechain from "@state/vechain";
import { VEX_NETWORK } from "@utils/constants";
import { formatNumber } from "@utils/functions"
import AddressLink from '../AddressLink';

import { Wrapper } from './styled';

const Vester = ({ vester, handleClaim }) => {
  const { address, unlock } = vechain.useContainer();
    return (
    <Wrapper>
      <thead>
        <tr>
          <th>Address</th>
          <th>Name</th>
          <th align="right">Balance</th>
          <th align="right">Amount Claimable</th>
        </tr>
      </thead>
      <tbody>
          <tr key={vester.address}>
            <td type="addr">
              <AddressLink shorten address={VEX_NETWORK.vex_governance_token.address} />
            </td>
            <td>VEX</td>
            <td type="num" align="center">
                {formatNumber(vester.vexBalance)}
            </td>
            <td type="num" align="right">
              {formatNumber(vester.claimableAmount)}
            </td>
            <td align="right">
            {address ? (
              <Button
                onClick={handleClaim}
                background={null}
                color={null}
              >
                Claim for DAO
              </Button>
            ) : (
              <Button onClick={unlock}>Connect wallet</Button>
            )}
            </td>
          </tr>
      </tbody>
    </Wrapper>
  )
}

export default Vester;
