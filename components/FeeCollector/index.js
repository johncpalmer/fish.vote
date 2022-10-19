import React from "react";
import { formatNumber } from "@utils/functions"
import AddressLink from '../AddressLink';

import { Wrapper } from './styled';

const FeeCollector = ({ data }) => {
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
      {data.map(({ balance, address, name }) => (
        <tr key={address}>
          <td type="addr">
            <AddressLink shorten address={address} />
          </td>
          <td>{name}</td>
          <td type="num" align="center">
              {formatNumber(balance)}
          </td>
        </tr>
      ))}
      </tbody>
    </Wrapper>
  )
}

export default FeeCollector;
