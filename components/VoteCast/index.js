import { Wrapper, InputWrapper } from './styled'; 

import styled, { css } from 'styled-components';

const BlockWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 24px;
  margin-top: 24px;
`;

const Block = styled.div`
  border-radius: 8px;
  flex: 1;
  padding: 24px;
  font-size: 2rem;
  font-family: VCR, sans-serif;
  text-transform: uppercase;
  color: ${({ alt }) => alt ? '#ff385c' : '#37C9AC'};


  ${({ alt }) => alt ? css`
    background: linear-gradient(96.84deg, rgba(255, 56, 92, 0.16) 1.04%, rgb(255, 56, 92, 0.08) 98.99%);
  ` : css`
    background: linear-gradient(96.84deg, rgba(55, 201, 172, 0.16) 1.04%, rgb(55, 201, 172, 0.08) 98.99%);
  `}
`;

const Total = styled.div`
  font-family: VCR, sans-serif;
  text-transform: uppercase;
  text-align: right;
  color: #ACACAB;
  margin-top: 24px;
`

const VoteCast = ({ color, votesFor, votesAgainst }) => (
  <Wrapper>
    <BlockWrapper>
      <Block>
        {parseFloat(votesFor).toLocaleString("us-en", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} For
      </Block>
      <Block alt>
        {parseFloat(votesAgainst).toLocaleString("us-en", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} Against
      </Block>
    </BlockWrapper>

    <Total>
      Total: {parseFloat(votesAgainst + votesFor).toLocaleString("us-en", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </Total>
  </Wrapper>
)

export default VoteCast;