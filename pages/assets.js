import { VEX_NETWORK } from "@utils/constants"; // Constants
import assets from "@state/assets";

import BalanceTable from "@components/BalanceTable";
import Card from "@components/Card";
import Description from "@components/Description";
import Layout from "@components/Layout";
import Loader from "@components/Loader";
import Switch from "@components/Switch";
import Vester from "@components/Vester";


export default function Assets() {

  const { balances, isLoading, vester, isLoadingVester, claimVEXFromVester } = assets.useContainer();

  const handleClaim = async () => {
    try {
      await claimVEXFromVester()
    }
    catch (error) {
        console.error("Error during claim VEX for DAO", error);
    }
  }

  return (
    <Layout short>
      {/* Path switch */}
      <center>
        <Switch
          activePath={2}
          paths={[
            {
              name: 'Home',
              url: '/',
            },
            {
              name: 'All',
              url: '/all',
            },
            {
              name: 'Assets',
              url: '/assets',
            },
          ]}
        />
      </center>

      {/* About card */}
      <Card shortMargin title="Assets Overview">
        <Description>
          <p>The Vexchange DAO's assets are held in the <a href={`${VEX_NETWORK.explorer_base_url}accounts/${VEX_NETWORK.timelock.address}`} rel="noopener noreferrer" target="_blank">Timelock smart contract</a>. LP tokens collected as platform fees are held by the fee collector smart contract, and are periodically converted to WVET and transferred to the Timelock for spending.</p>

          <p>The DAO's VEX are <a href="https://medium.com/@vexchange/introducing-vex-7be80d27b1de" rel="noopener noreferrer" target="_blank"> set to vest </a> over the course of 2 years with a 3-month cliff. The first VEX will be claimable on 11 February 2022. See the <a href={`${VEX_NETWORK.explorer_base_url}accounts/${VEX_NETWORK.vester.address}`}>Vester Contract</a>.</p>
        </Description>
      </Card>

      <Card title="Timelock">
        {isLoading ? (
          <Loader />
        ) : (
          <BalanceTable balances={balances} />
        )}
      </Card>

      <Card title="Treasury Vester">
        {isLoadingVester ? (
          <Loader />
        ) : (
          <Vester vester={vester} handleClaim={handleClaim}/>
        )}
      </Card>

    </Layout>
  );
}
