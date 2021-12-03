import { Wrapper } from "./styled";

const Empty = ({ content, link }) => (
  <Wrapper>
    <h3>Nothing here yet</h3>
    <p>{content}</p>

    {link}
  </Wrapper>
);

export default Empty;