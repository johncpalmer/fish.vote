import { VEX_CONSTANTS, VEX_NETWORK } from "@utils/constants"; // Constants
console.log(VEX_CONSTANTS)
import vechain from "@state/vechain";

import useBalances from "@hooks/useBalances";

import BalanceTable from "@components/BalanceTable";
import Card from "@components/Card";
import Description from "@components/Description";
import Layout from "@components/Layout";
import Loader from "@components/Loader";
import Switch from "@components/Switch";


export default function Assets() {
  const { provider } = vechain.useContainer();

  const { balances, isLoading } = useBalances(provider, [
    VEX_NETWORK.governor_alpha.address, // governer alpha
    VEX_NETWORK.timelock.address, // timelock
    VEX_NETWORK.vex_governance_token.address, // timelock
  ])

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
              name: 'New',
              url: '/new',
            },
            {
              name: 'Assets',
              url: '/assets',
            },
          ]}
        />
      </center>

      {/* About card */}
      <Card shortMargin>
        <Description>
          <h5>Assets Overview</h5>
          <p>The DAO's assets are held in the <a href={`https://explore.vechain.org/accounts/${VEX_NETWORK.timelock.address}`}>Timelock smart contract</a>. LP tokens collected as platform fees are held by the fee collector smart contract, and are periodically converted to WVET and transferred to the Timelock.</p>
        </Description>
      </Card>

      <Card title="Assets">
        {isLoading ? (
          <Loader />
        ) : (
          <BalanceTable balances={balances} />
        )}
      </Card>

    </Layout>
  );
}
