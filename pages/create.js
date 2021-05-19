import {
  InputWithTopLabel,
  TextAreaInputWithTopLabel,
} from "@components/Inputs"; // Components: Inputs
import Link from "next/link"; // Routing
import eth from "@state/eth"; // Global state: eth
import { useState } from "react"; // State management
import Card from "@components/Card"; // Component: Card
import { useRouter } from "next/router"; // Routing
import Action from "@components/Action"; // Component: Action
import Spacer from "@components/Spacer"; // Component: Spacer
import Layout from "@components/Layout"; // Component: Layout
import Loader from "react-loader-spinner"; // Loaders
import governance from "@state/governance"; // Global state: governance
import Breadcrumb from "@components/Breadcrumb"; // Component: Breadcrumb
import styles from "@styles/pages/Create.module.scss"; // Page styles

// Default state for an individual Action
const defaultActionState = [
  // Contract address
  null,
  // Function param
  null,
  // Targets array
  [],
  // Values array
  [],
];

export default function Create() {
  // Router
  const router = useRouter();

  // Global state
  const { address, unlock } = eth.useContainer();
  const { createProposal, inifiniteApproveFactory } = governance.useContainer();

  // Local state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);

  // Actions
  const [actions, setActions] = useState(
    // Create a default action
    [defaultActionState]
  );

  /**
   * Update actions array at index
   * @param {defaultActionState[]} value to update
   * @param {Number} index to update at
   */
  const updateActionsAtIndex = (value, index) => {
    let temp = actions;
    temp[index] = value;
    setActions([...temp]);
  };

  /**
   * Submit proposal creation with button loading toggle
   */
  const createProposalWithLoading = async () => {
    // Toggle loading
    setButtonLoading(true);

    try {
      // Create proposal
      const proposal_address = await createProposal(
        actions.map((action) => action[0]),
        actions.map((action) => action[1]),
        actions.map((action) => action[2]),
        actions.map((action) => action[3]),
        title,
        description
      );
      // Assuming proposal creation is successful, route to new proposal
      router.push(`/proposal/${proposal_address}`);
    } catch (error) {
      // Catch and log error
      console.log("Error when creating proposal: " + error);
    }

    // Toggle loading
    setButtonLoading(false);
  };

  return (
    <Layout>
      {/* Breadcrumb title */}
      <Breadcrumb
        title="Create a new proposal"
        lastRoute={{
          path: "/",
          name: "Home",
        }}
      />

      {/* Create desktop view */}
      <div className={styles.proposal__desktop}>
        {/* Proposal description card */}
        <Card title="Proposal Description">
          <div className="card__padding">
            <Spacer height="8" />

            {/* Title */}
            <InputWithTopLabel
              labelTitle="Title"
              type="text"
              value={title}
              onChangeHandler={setTitle}
              placeholder="Enter the title of your proposal..."
            />

            <Spacer height="24" />

            {/* Description */}
            <TextAreaInputWithTopLabel
              labelTitle="Overview"
              minRows={10}
              value={description}
              onChangeHandler={setDescription}
              placeholder="Describe your proposal..."
            />
          </div>
        </Card>

        {/* Actions card */}
        <Card title="Actions">
          {/* Actions */}
          <div>
            {actions.map((_, i) => {
              // For each action, render an Action component
              return (
                <Action
                  key={i}
                  index={i}
                  // Inject update handler (lets child manage state by self)
                  onChangeHandler={updateActionsAtIndex}
                />
              );
            })}
          </div>

          {/* Add Actions */}
          <div className={styles.card__add_action}>
            <button
              // On click:
              onClick={() =>
                // Update actions with [...actions, defaultAction]
                setActions((previous) => [...previous, defaultActionState])
              }
            >
              + Add Action
            </button>
          </div>
        </Card>

        {/* Submission card */}
        <Card title="Submit your proposal">
          <div className={styles.card__submit}>
            {buttonLoading ? (
              // Render loading status if tx submitting
              <center>
                <Loader type="Oval" color="#e7347a" height={50} width={50} />
              </center>
            ) : (
              // Else, render paragraph
              <p>
                After your proposal is created, it will appear at the bottom of
                the New page. If it receives more than 400 delegate votes, your
                proposal will appear on the Home page. You can terminate your
                proposal at any time after creation.
              </p>
            )}

            {address ? (
              <button
                onClick={createProposalWithLoading}
                // Disable button when awaiting transaction submission
                disabled={buttonLoading}
              >
                {buttonLoading ? "Submitting Proposal..." : "Submit Proposal"}
              </button>
            ) : (
              <button onClick={unlock}>Connect wallet</button>
            )}
          </div>
        </Card>
      </div>

      {/* Create mobile view */}
      <div className={styles.proposal__mobile}>
        <img src="/vectors/create.svg" alt="Create" />
        <h3>Head to Desktop</h3>
        <p>
          Proposal authoring is only supported on desktop for now. Head to a
          nearby computer to create a new crowd proposal.
        </p>
        <Link href="/">
          <a>{"<- Back to proposals"}</a>
        </Link>
      </div>
    </Layout>
  );
}
