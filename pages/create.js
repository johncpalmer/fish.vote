import {
  InputWithTopLabel,
  TextAreaInputWithTopLabel,
} from "@components/Inputs"; // Components: Inputs
import eth from "@state/eth"; // Global state: eth
import { useState } from "react"; // State management
import Card from "@components/Card"; // Component: Card
import Action from "@components/Action"; // Component: Action
import Spacer from "@components/Spacer"; // Component: Spacer
import Layout from "@components/Layout"; // Component: Layout
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
  // Global state
  const { address, unlock } = eth.useContainer();
  const { uni } = governance.useContainer();

  // Title + Descriptions
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

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

  return (
    <Layout>
      {/* Breadcrumb title */}
      <Breadcrumb title="Create a new proposal" />

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
            Submitting your autonomous proposal will require staking 100 UNI
            tokens. You can terminate the proposal at any time to retrieve your
            tokens.
          </p>

          {address ? (
            uni >= 100 ? (
              <button>Submit Proposal</button>
            ) : (
              <button disabled={true}>Insufficient Balance</button>
            )
          ) : (
            <button onClick={unlock}>Connect to a wallet</button>
          )}
        </div>
      </Card>
    </Layout>
  );
}
