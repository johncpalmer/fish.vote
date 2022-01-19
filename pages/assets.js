import { VEX_NETWORK } from "@utils/constants"; // Constants
import vechain from "@state/vechain";
import assets from "@state/assets";

import BalanceTable from "@components/BalanceTable";
import Card from "@components/Card";
import Description from "@components/Description";
import Layout from "@components/Layout";
import Loader from "@components/Loader";
import Switch from "@components/Switch";


export default function Assets() {
  const { provider } = vechain.useContainer();

  const { balances, isLoading } = assets.useContainer();

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
          <p>The Vexchange DAO's assets are held in the <a href={`https://explore.vechain.org/accounts/${VEX_NETWORK.timelock.address}`} rel="noopener noreferrer" target="_blank">Timelock smart contract</a>. LP tokens collected as platform fees are held by the fee collector smart contract, and are periodically converted to WVET and transferred to the Timelock for spending.</p>
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