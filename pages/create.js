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
import governance from "@state/governance"; // Global state: governance
import { UNI_NETWORK } from "@utils/constants"; // Constants
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
  const {
    uni,
    infiniteAllowance,
    createProposal,
    inifiniteApproveFactory,
  } = governance.useContainer();
  const { address, unlock } = eth.useContainer();

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
      await createProposal(
        actions.map((action) => action[0]),
        actions.map((action) => action[1]),
        actions.map((action) => action[2]),
        actions.map((action) => action[3]),
        title,
        description
      );
      // Assuming proposal creation is successful, route home
      router.push("/");
    } catch (error) {
      // Catch and log error
      console.log("Error when creating proposal: " + error);
    }

    // Toggle loading
    setButtonLoading(false);
  };

  /**
   * Approve factory contract with button loading toggle
   */
  const approveFactoryWithLoading = async () => {
    // Toggle loading
    setButtonLoading(true);

    try {
      // Approve factory to spend max(uin256) - 1 UNI
      await inifiniteApproveFactory();
    } catch (error) {
      // Catch and log error
      console.log("Error when approving factory contract: " + error);
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

            <Spacer height="32" />

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
            <p>
              Submitting your crowd proposal will require staking{" "}
              {UNI_NETWORK.minimum_uni} UNI tokens. You can terminate the
              proposal at any time to retrieve your tokens.
            </p>

            {address ? (
              uni >= UNI_NETWORK.minimum_uni ? (
                infiniteAllowance ? (
                  <button
                    onClick={createProposalWithLoading}
                    // Disable button when awaiting transaction submission
                    disabled={buttonLoading}
                  >
                    {buttonLoading
                      ? "Submitting Proposal..."
                      : "Submit Proposal"}
                  </button>
                ) : (
                  <button
                    onClick={approveFactoryWithLoading}
                    // Disable button when awaiting approval submission
                    disabled={buttonLoading}
                  >
                    {buttonLoading
                      ? "Approving Spend..."
                      : "Approve Spending UNI"}
                  </button>
                )
              ) : (
                <button disabled={true}>Insufficient Balance</button>
              )
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
