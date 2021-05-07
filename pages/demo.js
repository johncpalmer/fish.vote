import Card from "@components/Card";
import Layout from "@components/Layout";
import Breadcrumb from "@components/Breadcrumb";

export default function Demo() {
  return (
    <Layout>
      <Breadcrumb
        title="Renew Uniswap Grants Program for Q3 and Q4 2021"
        lastRoute={{
          path: "/",
          name: "Autonomous Proposals",
        }}
        status="In progress"
        created={new Date()}
        proposer="0x016C8780e5ccB32E5CAA342a926794cE64d9C364"
      />
      <Card
        title="Recent Proposals"
        action={{
          name: "Create Proposal",
          handler: () => console.log("Testing"),
        }}
      >
        <span>Test child content</span>
      </Card>
      <Card title="Proposal Description">
        <span>Test child content</span>
      </Card>
    </Layout>
  );
}
