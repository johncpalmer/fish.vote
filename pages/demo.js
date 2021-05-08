import {
  InputWithTopLabel,
  TextAreaInputWithTopLabel,
} from "@components/Inputs";
import Card from "@components/Card";
import Layout from "@components/Layout";
import Spacer from "@components/Spacer";
import Breadcrumb from "@components/Breadcrumb";

export default function Demo() {
  return (
    <Layout>
      <Breadcrumb
        title="Renew Uniswap Grants Program for Q3 and Q4 2021"
        lastRoute={{
          path: "/",
          name: "Autonomous Proposals",
        }}
        status="In progress"
        created={new Date()}
        proposer="0x016C8780e5ccB32E5CAA342a926794cE64d9C364"
      />
      <Card
        title="Recent Proposals"
        action={{
          name: "Create Proposal",
          handler: () => console.log("Testing"),
        }}
      >
        <span>Test child content</span>
      </Card>
      <Card title="Proposal Details" subtext="2 actions">
        <span>Test child content</span>
      </Card>
      <Card title="Proposal Description">
        <span>Test child content</span>
      </Card>
      <Card title="Card w/ Spacing">
        <div className="card__padding">
          <span>Test child content</span>
        </div>
      </Card>
      <Card title="Card w/ Input fields">
        <div className="card__padding">
          <Spacer height="8" />
          <InputWithTopLabel
            type="text"
            labelTitle="Single Input"
            placeholder="Single Input placeholder"
          />

          <Spacer height="32" />

          <TextAreaInputWithTopLabel
            labelTitle="TextArea"
            minRows={10}
            placeholder="TextArea placeholder w/ 10 minimum rows."
          />
        </div>
      </Card>
    </Layout>
  );
}
