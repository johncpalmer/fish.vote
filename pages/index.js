import axios from "axios"; // Requests
import Card from "@components/Card"; // Component: Card
import { useRouter } from "next/router"; // Routing
import Layout from "@components/Layout"; // Component: Layout
import Breadcrumb from "@components/Breadcrumb"; // Component: Breadcrumb
import { useState, useEffect } from "react";
import styles from "@styles/pages/Home.module.scss"; // Component styles

export default function Home() {
  const router = useRouter(); // Setup router
  const [loading, setLoading] = useState(true); // Proposal loading state
  const [proposals, setProposals] = useState([]); // Proposals array

  /**
   * Routes clicker to /create
   * @param {MouseEvent} e event to track
   */
  const routeToCreate = (e) => {
    e.preventDefault();
    router.push("/create");
  };

  const fetchProposals = async () => {
    const response = await axios.get("/api/proposals");
    const data = response.data;

    // Update state
    setProposals(data);
    setLoading(false);
  };

  // Collect proposals on page load
  useEffect(fetchProposals, []);

  return (
    <Layout>
      {/* Page header */}
      <Breadcrumb title="Overview" />

      {/* Show all automated proposals */}
      <Card
        title="Recent Proposals"
        action={{
          name: "Create Proposal",
          handler: routeToCreate,
        }}
      >
        {loading ? (
          <div className={styles.home__loading}>
            <p>Loading...</p>
          </div>
        ) : proposals.length < 1 ? (
          <div className={styles.home__loading}>
            <p>No Proposals</p>
          </div>
        ) : (
          <div className={styles.home__loading}>
            <p>Some proposals</p>
          </div>
        )}
      </Card>
    </Layout>
  );
}
