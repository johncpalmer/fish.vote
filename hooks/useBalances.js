import { useState, useEffect } from "react"; // Local state management
import { find, isEmpty } from 'lodash';
import { utils } from 'ethers';

import VEXABI from "@utils/abi/vex";
import { VEX_NETWORK } from "@utils/constants";

const balanceOfABI = find(VEXABI, { name: 'balanceOf' });

function useBalances(provider, addresses) {
  const [isLoading, setIsLoading] = useState(false);
  const [balances, setBalances] = useState([]);

  useEffect(() => {
    const getBalances = () => {
      setIsLoading(true);

      const balancePromises = addresses.map(async address => {
        const balanceOfMethod = provider.thor.account(VEX_NETWORK.vex_governance_token.address).method(balanceOfABI);
        const { decoded } = await balanceOfMethod.call(address);

        return {
          address,
          balance: utils.formatUnits(decoded['0']),
        };
      });

      Promise.all(balancePromises).then(data => {
        setBalances(data);
        setIsLoading(false);
      })
    }

    if (isEmpty(balances) && !isEmpty(addresses) && provider) {
      getBalances();
    }
  }, [provider, addresses]);

  return { balances, isLoading };
}

export default useBalances;

