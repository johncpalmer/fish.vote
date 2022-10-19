import vechain from "@state/vechain";
import { find, isEmpty } from 'lodash';
import { createContainer } from "unstated-next";
import { useEffect, useState, useReducer } from "react";
import { VEX_NETWORK } from "@utils/constants";
import { utils, ethers } from "ethers";
import { SWEEP_DESIRED_ABI, SELL_HOLDING_ABI } from "@utils/abi/FeeCollector";
import { DISTRIBUTE_ABI } from "@utils/abi/Distributor";
import VEXABI from "@utils/abi/vex";
import TreasuryVesterABI from "@utils/abi/TreasuryVester";
import setTransaction from "@utils/transaction";

import {
  ACTIONS,
  initialState,
  reducer,
} from './state'

const useAssets = () => {
  const { provider, address } = vechain.useContainer();

  const [state, dispatch] = useReducer(reducer, initialState);
  const [updateBalances, setUpdateBalances] = useState(false);

  useEffect(() => {
    const balanceOfABI = find(VEXABI, { name: 'balanceOf' });

    // Get timelock balances
    const getTimelockBalances = () => {
      dispatch({ type: ACTIONS.GET_TIMELOCK_BALANCES });

      const balancePromises = VEX_NETWORK.timelock.displayed_assests.map(async token => {
        const balanceOfMethod = provider.thor.account(token.address).method(balanceOfABI);
        const { decoded } = await balanceOfMethod.call(VEX_NETWORK.timelock.address);

        return {
          address: token.address,
          name: token.name,
          balance: utils.formatUnits(decoded['0']),
        };
      });

      Promise.all(balancePromises).then(data => {
        dispatch({ type: ACTIONS.GET_TIMELOCK_BALANCES_SUCCESS, data });
      })
    };

    // Get distributor balances
    const getDistributor = () => {
      dispatch({ type: ACTIONS.GET_DISTRIBUTOR_BALANCES });

      const balancePromises = VEX_NETWORK.distributor.displayed_assests.map(async token => {
        const balanceOfMethod = provider.thor.account(token.address).method(balanceOfABI);
        const { decoded } = await balanceOfMethod.call(VEX_NETWORK.distributor.address);

        return {
          address: token.address,
          name: token.name,
          balance: utils.formatUnits(decoded['0']),
        };
      });

      Promise.all(balancePromises).then(data => {
        dispatch({ type: ACTIONS.GET_DISTRIBUTOR_BALANCES_SUCCESS, data });
      })
    }

    // Get vester balances
    const getVester = async () => {
      dispatch({ type: ACTIONS.GET_VESTER_BALANCES });

      const address = VEX_NETWORK.vester.address
      const balanceOfMethod = provider.thor.account(VEX_NETWORK.vex_governance_token.address).method(balanceOfABI);

      const vesterABIs = ['vestingBegin', 'vestingEnd', 'vestingAmount', 'lastUpdate'].map( methodName => find(TreasuryVesterABI, { name: methodName }));
      const vesterMethods = vesterABIs.map( abi => provider.thor.account(address).method(abi).call());

      const vexBalanceResult  = (await balanceOfMethod.call(address)).decoded[0];
      const vesterNumbers = (await Promise.all(vesterMethods)).map(result => result.decoded['0']);

      const currentBlockTimestamp = (await provider.thor.block().get()).timestamp;
      const vestingEnd = +vesterNumbers[1]
      const vestingBegin = +vesterNumbers[0]
      const lastUpdate = +vesterNumbers[3]
      const vestingAmount = vesterNumbers[2]

      const balance = utils.formatUnits(vexBalanceResult)

      let claimableAmount

      if (currentBlockTimestamp >= vestingEnd) {
        claimableAmount = vexBalance;
      } else {
        const rawAmount = ethers.BigNumber.from(vestingAmount).mul(currentBlockTimestamp - lastUpdate).div(vestingEnd - vestingBegin);
        claimableAmount = utils.formatUnits(rawAmount.toString());;
      }

      dispatch({
        type: ACTIONS.GET_VESTER_BALANCES_SUCCESS,
        data: {
          address,
          claimableAmount,
          balance,
        }
      });
    }

    // Get vex FeeCollector
    const getVexFeeCollector = async () => {
      dispatch({ type: ACTIONS.GET_VEX_BALANCES });

      const balancePromises = VEX_NETWORK.vex_fee_collector.displayed_assests.map(async token => {
        const balanceOfMethod = provider.thor.account(token.address).method(balanceOfABI);
        const { decoded } = await balanceOfMethod.call(VEX_NETWORK.vex_fee_collector.address);

        return {
          address: token.address,
          name: token.name,
          balance: utils.formatUnits(decoded['0']),
        };
      });

      Promise.all(balancePromises).then(data => {
        dispatch({ type: ACTIONS.GET_VEX_BALANCES_SUCCESS, data });
      })
    }

    const getWvetFeeCollector = async () => {
      dispatch({ type: ACTIONS.GET_WVET_BALANCES });

      const balancePromises = VEX_NETWORK.wvet_fee_collector.displayed_assests.map(async token => {
        const balanceOfMethod = provider.thor.account(token.address).method(balanceOfABI);
        const { decoded } = await balanceOfMethod.call(VEX_NETWORK.wvet_fee_collector.address);

        return {
          address: token.address,
          name: token.name,
          balance: utils.formatUnits(decoded['0']),
        };
      });

      Promise.all(balancePromises).then(data => {
        dispatch({ type: ACTIONS.GET_WVET_BALANCES_SUCCESS, data });
      })
    }

    // Get timelock balances
    if ((isEmpty(state.timelock.data) || updateBalances) && provider) {
      getTimelockBalances();
    }

    // Get vester balances
    if ((isEmpty(state.vester.data) || updateBalances) && provider) {
      getVester();
      setUpdateBalances(false)
    }

    // Get vex FeeCollector
    if ((isEmpty(state.vex.data) || updateBalances) && provider && VEX_NETWORK.vex_fee_collector) {
      getVexFeeCollector();
      setUpdateBalances(false)
    }

    // Get wvet FeeCollector
    if ( (isEmpty(state.wvet.data) || updateBalances) && provider && VEX_NETWORK.wvet_fee_collector) {
      getWvetFeeCollector();
      setUpdateBalances(false)
    }

    // Get distributor balances
    if ( (isEmpty(state.distributor.data) || updateBalances) && provider && VEX_NETWORK.wvet_fee_collector) {
      getDistributor();
      setUpdateBalances(false)
    }

  }, [provider, updateBalances]);

  const recieveFunds = async () => {
    // ---------------------- Method ---------------------- //
    // 1. sweep wvet fee collector
    const wvetSweepMethod = provider.thor.account(VEX_NETWORK.wvet_fee_collector.address).method(SWEEP_DESIRED_ABI);

    // 2. distribute
    const distributeMethod = provider.thor.account(VEX_NETWORK.distributor.address).method(DISTRIBUTE_ABI);

    // 3. sweep vex fee collector
    const vexSweepMethod = provider.thor.account(VEX_NETWORK.vex_fee_collector.address).method(SWEEP_DESIRED_ABI);

    // 4. sell into vex
    const sellHoldingVexMethod = provider.thor.account(VEX_NETWORK.vex_fee_collector.address).method(SELL_HOLDING_ABI);

    // ---------------------- Clauses ---------------------- //
    // 1. sweep wvet fee collector
    const wvetSweepClause = wvetSweepMethod.asClause();

    // 2. distribute
    const distributeClause = distributeMethod.asClause();

    // 3. sell into vex
    const sellHoldingVexClause = sellHoldingVexMethod.asClause(VEX_NETWORK.wvet.address);

    // 4. sweep vex fee collector
    const vexSweepClause = vexSweepMethod.asClause();

    // ---------------------- Responses ---------------------- //
    try {
      // 0. sell into wvet
      const txResponse = await provider.vendor.sign('tx', [
        wvetSweepClause,
        distributeClause,
        sellHoldingVexClause,
        vexSweepClause,
      ])
        .signer(address)
        .comment("Sell holding vet response")
        .request()

      await setTransaction(txResponse, provider);
      setUpdateBalances(true);
    } catch (error) {
      console.log(error)
    }
  }

  const getUsdTokenPrice = async (tokenAddress, pairs, tokens ) => {
    if (tokens[tokenAddress]) return tokens[tokenAddress].usdPrice
    //It must be an LP token
    const totalSupplyABI = find(VEXABI, { name: "totalSupply" });
    const totalSupplyMethod = provider.thor.account(tokenAddress).method(totalSupplyABI);
    const tokenSupply  = utils.formatUnits((await totalSupplyMethod.call()).decoded[0]);
    const pairInfo = pairs[tokenAddress];
    const { token0, token0Reserve, token1, token1Reserve } = pairInfo;
    const tokenPrice = (token0.usdPrice * token0Reserve + token1.usdPrice * token1Reserve) / tokenSupply;

    return tokenPrice;
  };

  const claimVEXFromVester = () => {}

  return {
    state,
    dispatch,
    recieveFunds,
    claimVEXFromVester,
    getUsdTokenPrice
  }
}

// Create unstated-next container
const assets = createContainer(useAssets);
export default assets;
