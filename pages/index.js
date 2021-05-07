import Card from "@components/Card"; // Component: Card
import { useRouter } from "next/router"; // Routing
import Layout from "@components/Layout"; // Component: Layout
import Breadcrumb from "@components/Breadcrumb"; // Component: Breadcrumb

export default function Home() {
  const router = useRouter(); // Setup router

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
        <span>Proposals here</span>
      </Card>
    </Layout>
  );
}
