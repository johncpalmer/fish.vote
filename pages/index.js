import axios from "axios"; // Requests
import Link from "next/link"; // Routing: Links
import Card from "@components/Card"; // Component: Card
import { useRouter } from "next/router"; // Routing: Router
import Layout from "@components/Layout"; // Component: Layout
import Loader from "react-loader-spinner"; // Loaders
import { useState, useEffect } from "react"; // State management
import Breadcrumb from "@components/Breadcrumb"; // Component: Breadcrumb
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

  /**
   * Fetch proposals from api endpoint
   */
  const fetchProposals = async () => {
    // Collect proposal data
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
          <div className="card__padding">
            <center>
              <Loader type="Oval" color="#e7347a" height={50} width={50} />
            </center>
          </div>
        ) : proposals.length < 1 ? (
          <div className="card__padding">
            <div className={styles.home__empty}>
              <h3>No Autonomous Proposals Found</h3>
            </div>
          </div>
        ) : (
          <div className={styles.home__loading}>
            {proposals.map((proposal, i) => {
              return (
                <Link href={`/proposal/${proposal.contract}`} key={i}>
                  <a className={styles.home__proposal}>
                    <div>
                      <h4>{proposal.title}</h4>
                      <span>{proposal.timestamp}</span>
                    </div>
                    <div>
                      <span>Status</span>
                    </div>
                  </a>
                </Link>
              );
            })}
          </div>
        )}
      </Card>
    </Layout>
  );
}
