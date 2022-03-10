import React from "react";
import Button from "@components/Button";
import vechain from "@state/vechain";
import { formatNumber } from "@utils/functions"
import AddressLink from '../AddressLink';

import { Wrapper } from './styled';

const FeeCollector = ({ feeCollector, handleClaim }) => {
  const { address, unlock } = vechain.useContainer();
    return (
    <Wrapper>
      <thead>
        <tr>
          <th>Address</th>
          <th>Name</th>
          <th align="right">Balance</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
      {feeCollector.map(({ balance, address, name }) => (
          <tr key={address}>
            <td type="addr">
              <AddressLink shorten address={address} />
            </td>
            <td>{name}</td>
            <td type="num" align="center">
                {formatNumber(balance)}
            </td>
            <td align="right">
            {address ? (
              <Button
                onClick={() => handleClaim(address)}
                background={null}
                color={null}
                disabled={balance === '0.0'}
              >
                Claim for DAO
              </Button>
            ) : (
              <Button onClick={unlock}>Connect wallet</Button>
            )}
            </td>
          </tr>
      ))}
      </tbody>
    </Wrapper>
  )
}

export default FeeCollector;
