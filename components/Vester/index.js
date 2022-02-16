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
          <td type="addr" data-label="Address">
            <AddressLink shorten address={VEX_NETWORK.vex_governance_token.address} />
          </td>
          <td data-label="Name">VEX</td>
          <td type="num" align="center" data-label="Balance">
              {formatNumber(vester.vexBalance)}
          </td>
          <td type="num" align="right" data-label="Amount Claimable">
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
