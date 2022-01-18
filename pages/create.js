import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { isMobile } from 'react-device-detect';

import vechain from "@state/vechain";
import governance from "@state/governance";

import Loader from "@components/Loader";
import Textarea from "@components/Textarea";
import Button from "@components/Button";
import Card from "@components/Card";
import { Submit, Add } from "@components/Card/styled";
import Input from '@components/Input';
import Action from "@components/Action";
import Layout from "@components/Layout";
import Breadcrumb from "@components/Breadcrumb";

const defaultActionState = [null, null, [], []];

export default function Create() {
  const router = useRouter();
  const { address, unlock } = vechain.useContainer();
  const { createProposal } = governance.useContainer();

  // Local state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);

  const [actions, setActions] = useState(
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

    try {
      // Create proposal
      const proposalId = await createProposal(
        actions.map((action) => action[0]),
        actions.map((action) => action[1]),
        actions.map((action) => action[2]),
        actions.map((action) => action[3]),
        title,
        description
      );
      // Assuming proposal creation is successful, route to new proposal
      router.push(`/proposal/${proposalId}`);
    } catch (error) {
      console.log("Error when creating proposal: " + error);
    }

  };

  return (
    <Layout>
      <Breadcrumb
        title="Create a new proposal"
        lastRoute={{
          path: "/",
          name: "Home",
        }}
      />

      {isMobile ? (
        <>
          <img src="/vectors/create.svg" alt="Create" />
          <h3>Head to Desktop</h3>
          <p>
            Proposal authoring is only supported on desktop for now. Head to a
            nearby computer to create a new crowd proposal.
          </p>
          <Link href="/">
            <a>{"<- Back to proposals"}</a>
          </Link>
        </>
      ) : (
        <>
          <Card title="Proposal Description">
            <Input
              label="Title"
              type="text"
              value={title}
              onChange={setTitle}
              placeholder="Enter the title of your proposal..."
            />

            <Textarea
              label="Overview"
              minRows={10}
              value={description}
              onChangeHandler={setDescription}
              placeholder="Describe your proposal..."
            />
          </Card>

          <Card title="Actions" noPadding>
            {actions.map((_, i) => (
              <Action
                index={i}
                key={i}
                onChangeHandler={updateActionsAtIndex}
              />
            ))}

            { actions.length < 10 ? (
              <Add>
                <Button
                  // Do not allow more than 10 actions
                  // As governorAlpha only allows max 10 actions
                  disabled={actions.length >= 10}
                  // On click:
                  onClick={() =>
                    // Update actions with [...actions, defaultAction]
                    setActions((previous) => [...previous, defaultActionState])
                  }
                >
                  + Add Action
                </Button>
              </Add>
            ) : null}

          </Card>

          <Card title="Submit your proposal">
            <Submit>
              <p>
                After your proposal is created, it will appear at the bottom of
                the New page. If it receives more than 400 delegate votes, your
                proposal will appear on the Home page. You can terminate your
                proposal at any time after creation.
              </p>

              {address ? (
                <Button
                  onClick={createProposalWithLoading}
                  disabled={buttonLoading}
                >
                  {buttonLoading ? "Submitting Proposal..." : "Submit Proposal"}
                </Button>
              ) : (
                <Button onClick={unlock}>Connect wallet</Button>
              )}
            </Submit>
          </Card>
        </>
      )}
    </Layout>
  );
}
