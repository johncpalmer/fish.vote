import { React, useEffect, useState } from "react";
import { formatDollarAmount, formatNumber } from "@utils/functions";
import AddressLink from "../AddressLink";
import assets from "@state/assets";
import tokenInfo from "@state/tokenInfo";
import pairInfo from "@state/pairInfo";

const BalanceRow = ({ balance, address, name }) => {
  const { tokens } = tokenInfo.useContainer();
  const { pairs } = pairInfo.useContainer();
  const { getUsdTokenPrice} = assets.useContainer();
  const [ usdTokenPrice, setUsdTokenPrice] = useState()

  useEffect(() => {
    const getUsdPrice = async () => {
      setUsdTokenPrice(await getUsdTokenPrice(address, pairs, tokens))
    }
    if (pairs && tokens && address) {
      getUsdPrice()
    }
  }, [pairs, tokens, address])
  return (
    <>
      <tr key={address}>
        <td type="addr" data-label="Address">
          <AddressLink shorten address={address} />
        </td>
        <td data-label="Name">{name}</td>
        <td type="num" align="center" data-label="Amount">
          {formatNumber(balance)}
        </td>
        <td type="num" align="right" data-label="USD Value">
          { usdTokenPrice? formatDollarAmount(balance * usdTokenPrice) : null}
        </td>
      </tr>
    </>
  );
};

export default BalanceRow;
