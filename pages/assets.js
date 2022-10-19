import { VEX_NETWORK } from "@utils/constants"; // Constants
import vechain from "@state/vechain";
import assets from "@state/assets";
import * as ACTIONS from "@state/assets/state";

import BalanceTable from "@components/BalanceTable";
import Button from "@components/Button";
import Card  from "@components/Card";
import Description from "@components/Description";
import Layout from "@components/Layout";
import Loader from "@components/Loader";
import Switch from "@components/Switch";
import Vester from "@components/Vester";
import Divider from "@components/Divider";
import FeeCollector from "@components/FeeCollector";
import Block, { Col } from "@components/Block";

export default function Assets() {
  const { address, unlock } = vechain.useContainer();

  const {
    state,
    claimVEXFromVester,
    recieveFunds,
  } = assets.useContainer();

  const handleClaimVEXFromVester = async () => {
    try {
      await claimVEXFromVester()
    }
    catch (error) {
        console.error("Error during claim VEX for DAO", error);
    }
  }

  const handleOnClick = () => {
    recieveFunds()
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

      <Card title="Treasury Vester">
        {state.vester.isLoading ? (
          <Loader />
        ) : (
          <Vester data={state.vester.data} handleClaim={handleClaimVEXFromVester}/>
        )}
      </Card>

      <Divider />

      <Card title="WVET Fee Collector">
        {state.wvet.isLoading ? (
          <Loader />
        ) : (
          <FeeCollector data={state.wvet.data} />
        )}
      </Card>

      <Divider horizontal />

      <Card title="Distributor">
        {state.distributor.isLoading ? (
          <Loader />
        ) : (
          <BalanceTable data={state.distributor.data} />
        )}
      </Card>

      <Block>
        <Col>
          <Divider horizontal />
        </Col>
        <Col>
          <Divider horizontal />
        </Col>
      </Block>

      <Block>
        <Col>
          <Card title="VEX Fee Collector">
            {state.vex.isLoading ? (
              <Loader />
            ) : (
              <FeeCollector data={state.vex.data} />
            )}
          </Card>
        </Col>

        <Col>
          <Card
            title="Timelock"
            special
            footer={
              address ? (
                <Button onClick={handleOnClick}>Receive Funds</Button>
              ) : (
                <Button onClick={unlock}>Connect wallet</Button>
              )
            }
          >
            {state.timelock.isLoading ? (
              <Loader />
            ) : (
              <BalanceTable data={state.timelock.data} />
            )}
          </Card>
        </Col>
      </Block>

    </Layout>
  );
}
