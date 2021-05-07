import {
  TextInputWithTopLabel,
  TextAreaInputWithTopLabel,
} from "@components/Inputs"; // Components: Inputs
import { useState } from "react"; // State management
import Card from "@components/Card"; // Component: Card
import Spacer from "@components/Spacer"; // Component: Spacer
import Layout from "@components/Layout"; // Component: Layout
import Breadcrumb from "@components/Breadcrumb"; // Component: Breadcrumb

export default function Create() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <Layout>
      <Breadcrumb title="Create a new proposal" />
      <Card title="Proposal Description">
        <div className="card__padding">
          <Spacer height="8" />

          {/* Title */}
          <TextInputWithTopLabel
            labelTitle="Title"
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
      <Card title="Actions">
        <div className="card__padding">
          <span>Title / Overview</span>
        </div>
      </Card>
      <Card title="Submit your proposal">
        <div className="card__padding">
          <p>
            Submitting your autonomous proposal will require staking 100 UNI
            tokens. You can terminate the proposal at any time to retrieve your
            tokens.
          </p>
        </div>
      </Card>
    </Layout>
  );
}
