import React from "react";
import numeral from 'numeral';

import AddressLink from '../AddressLink';

import { Wrapper } from './styled';

const BalanceTable = ({ balances }) => {
  const formatNumber = num => numeral(num).format('$0,0.00');

  return (
    <Wrapper>
      <thead>
        <tr>
          <th>Address</th>
          <th>Description</th>
          <th align="right">Amount</th>
        </tr>
      </thead>
      <tbody>
        {balances.map(({ balance, address }) => (
          <tr key={address}>
            <td type="addr">
              <AddressLink address={address} />
            </td>
            <td>BoredApeYachtClub Contract</td>
            <td type="num" align="right">
              {formatNumber(balance)}
            </td>
          </tr>
        ))}
      </tbody>
    </Wrapper>
  )
}

export default BalanceTable;
