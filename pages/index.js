import dayjs from "dayjs"; // Date parsing
import Link from "next/link"; // Routing: Links
import Card from "@components/Card"; // Component: Card
import { useRouter } from "next/router"; // Routing: Router
import Layout from "@components/Layout"; // Component: Layout
import Loader from "react-loader-spinner"; // Loaders
import Breadcrumb from "@components/Breadcrumb"; // Component: Breadcrumb
import styles from "@styles/pages/Home.module.scss"; // Component styles
import governance from "@state/governance";

export default function Home() {
  const router = useRouter(); // Setup router
  const { proposals, loadingProposals } = governance.useContainer();

  /**
   * Routes clicker to /create
   * @param {MouseEvent} e event to track
   */
  const routeToCreate = (e) => {
    e.preventDefault();
    router.push("/create");
  };

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
        {loadingProposals ? (
          // If proposals are still loading, show spinner
          <div className="card__padding">
            <center>
              <Loader type="Oval" color="#e7347a" height={50} width={50} />
            </center>
          </div>
        ) : proposals.length < 1 ? (
          // Else if no proposals exist, show empty state
          <div className="card__padding">
            <div className={styles.home__empty}>
              <h3>No Autonomous Proposals Found</h3>
            </div>
          </div>
        ) : (
          <div className={styles.home__loading}>
            {proposals.map((proposal, i) => {
              // Else if proposals exist
              return (
                // Loop over each proposal and render a proposal link
                <Link href={`/proposal/${proposal.contract}`} key={i}>
                  <a className={styles.home__proposal}>
                    {/* Proposal title + date */}
                    <div>
                      <h4>{proposal.title}</h4>
                      <span>
                        Created{" "}
                        {dayjs.unix(proposal.timestamp).format("MMMM D, YYYY")}
                      </span>
                    </div>

                    {/* Proposal current status */}
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
