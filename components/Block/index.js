import { Wrapper, StyledCol } from "./styled";

const Block = ({ children }) => (
  <Wrapper>
    { children }
  </Wrapper>
);

export const Col = ({ children }) => (
  <StyledCol>
    { children }
  </StyledCol>
);

export default Block;
