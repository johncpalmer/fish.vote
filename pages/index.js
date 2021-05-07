import Breadcrumb from "@components/Breadcrumb";
import Layout from "@components/Layout";

export default function Home() {
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
    </Layout>
  );
}
