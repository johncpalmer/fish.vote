import { createContainer } from "unstated-next";
import { useEffect, useState } from "react";
import axios from "axios";
import { MAINNET, VEX_CONSTANTS } from "@utils/constants";

function useTokenInfo()
{
    const [tokens, setTokens] = useState({});

    useEffect(async () => {
        let result;
        if (MAINNET)
        {
            result = (await axios.get("https://api.vexchange.io/v1/tokens")).data;
        }
        else
        {
            // mock data for testnet
            result = {
                 [VEX_CONSTANTS["testnet"].wvet.address]: {
                    "name": "Wrapped VET",
                    "symbol": "WVET",
                    "usdPrice": 0.076775,
                    "decimals": 18
                },
                [VEX_CONSTANTS["testnet"].vex_governance_token.address]: {
                    "name": "Vexchange",
                    "symbol": "VEX",
                    "usdPrice": 2.934962228084993,
                    "decimals": 18
                }
            }
        }

        setTokens(result);
    }, []);

    return {
        tokens
    }
}

// Create unstated-next container
const tokenInfo = createContainer(useTokenInfo);
export default tokenInfo;
