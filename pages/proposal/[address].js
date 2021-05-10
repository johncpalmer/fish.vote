import Layout from "@components/Layout"; // Component: Layout
import { useRouter } from "next/router"; // Routing
import governance from "@state/governance"; // Global governance state
import { useState, useEffect } from "react"; // React state management
import Breadcrumb from "@components/Breadcrumb"; // Component: Breadcrumb

export default function Proposal({ address }) {
  // Routing
  const router = useRouter();

  // Global state
  const { collectProposalByContract } = governance.useContainer();

  // Local state
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Fetch proposal details
   */
  const fetchProposal = async () => {
    // Collect proposal from global state (or pull if no proposals exist)
    const proposal = await collectProposalByContract(address);

    // If proposal does not exist
    if (!proposal.success) {
      // Return to "/"
      await router.push("/");
    }

    // Else, toggle loading and update data
    setData(proposal.data);
    setLoading(false);
  };

  useEffect(fetchProposal, []);

  return (
    <Layout>
      {!loading ? (
        <Breadcrumb
          title={data.title}
          lastRoute={{
            path: "/",
            name: "Autonomous Proposals",
          }}
          // FIXME:
          status="In progress"
          created={data.timestamp}
          proposer={data.args[1]}
        />
      ) : (
        <p>Loading...</p>
      )}
    </Layout>
  );
}

// Run on page load
export async function getServerSideProps({ params: { address } }) {
  // Return retrieved content
  return {
    // As prop
    props: {
      address,
    },
  };
}
