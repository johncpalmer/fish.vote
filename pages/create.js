import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { isMobile } from 'react-device-detect';
import Loader from "react-loader-spinner";

import vechain from "@state/vechain";
import governance from "@state/governance";

import { TextAreaInputWithTopLabel } from "@components/Inputs";
import Button from "@components/Button";
import Card from "@components/Card";
import { Submit, Add } from "@components/Card/styled";
import Input from '@components/Input';
import Action from "@components/Action";
import Spacer from "@components/Spacer";
import Layout from "@components/Layout";
import Breadcrumb from "@components/Breadcrumb";

const defaultActionState = [null, null, [], []];

export default function Create() {
  const router = useRouter();
  const { address, unlock } = vechain.useContainer();
  const { createProposal, inifiniteApproveFactory } = governance.useContainer();
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
    setButtonLoading(true);

    try {
      const proposal_address = await createProposal(
        actions.map((action) => action[0]),
        actions.map((action) => action[1]),
        actions.map((action) => action[2]),
        actions.map((action) => action[3]),
        title,
        description
      );

      router.push(`/proposal/${proposal_address}`);
    } catch (error) {
      console.log("Error when creating proposal: " + error);
    }

    setButtonLoading(false);
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

            <TextAreaInputWithTopLabel
              labelTitle="Overview"
              minRows={10}
              value={description}
              onChangeHandler={setDescription}
              placeholder="Describe your proposal..."
            />
          </Card>

          <Card title="Actions" noPadding>
            {actions.map((_, i) => {
              return (
                <Action key={i} index={i} onChangeHandler={updateActionsAtIndex} />
              );
            })}

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
          </Card>

          <Card title="Submit your proposal">
            <Submit>
              {buttonLoading ? (
                <center>
                  <Loader type="Oval" color="#f5a788" height={50} width={50} />
                </center>
              ) : (
                <p>
                  After your proposal is created, it will appear at the bottom of
                  the New page. If it receives more than 400 delegate votes, your
                  proposal will appear on the Home page. You can terminate your
                  proposal at any time after creation.
                </p>
              )}

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
