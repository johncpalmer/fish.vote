import Layout from "@components/Layout";
import Breadcrumb from "@components/Breadcrumb";

export default function Proposal({ id }) {
  console.log(id);

  return (
    <Layout>
      <Breadcrumb
        title={`Proposal ${id.toString()}`}
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

// Run on page load
export async function getServerSideProps({ params }) {
  // Return retrieved content
  return {
    // As prop
    props: {
      id: params.id,
    },
  };
}
