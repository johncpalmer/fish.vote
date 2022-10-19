import React from "react";
import { Wrapper } from "./styled";
import BalanceRow from "./BalanceRow";

const BalanceTable = ({ data }) => (
  <Wrapper>
    <thead>
      <tr>
        <th>Address</th>
        <th>Name</th>
        <th align="right">Amount</th>
        <th align="right">USD Value</th>
      </tr>
    </thead>
    <tbody>
      {data.map(({ balance, address, name }) => (
        <BalanceRow key={address} balance={balance} address={address} name={name} />
      ))}
    </tbody>
  </Wrapper>
);

export default BalanceTable;
