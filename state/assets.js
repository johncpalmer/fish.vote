import vechain from "@state/vechain";
import { find, isEmpty } from 'lodash';
import { createContainer } from "unstated-next";
import { useEffect, useState } from "react";
import { VEX_NETWORK } from "@utils/constants";
import { utils } from "ethers";
import VEXABI from "@utils/abi/vex";

function useAssets()
{
    const { provider } = vechain.useContainer();

    // list of token addresses to display as assets
    const DISPLAYED_ASSETS = [
        VEX_NETWORK.vex_governance_token,
        VEX_NETWORK.wvet,
        ];

    const [balances, setBalances] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getBalances = () => {
            setIsLoading(true);
            const balanceOfABI = find(VEXABI, { name: 'balanceOf' });

            const balancePromises = DISPLAYED_ASSETS.map(async token => {
                const balanceOfMethod = provider.thor.account(token.address).method(balanceOfABI);
                const { decoded } = await balanceOfMethod.call(VEX_NETWORK.timelock.address);

                return {
                    address: token.address,
                    name: token.name,
                    balance: utils.formatUnits(decoded['0']),
                };
            });

            Promise.all(balancePromises).then(data => {
                setBalances(data);
                setIsLoading(false);
            })
        }

        if (isEmpty(balances) && provider) {
            getBalances();
        }
    }, [provider]);

    return {
        balances,
        isLoading
    }
}

// Create unstated-next container
const assets = createContainer(useAssets);
export default assets;
