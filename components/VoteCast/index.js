import {
  Wrapper,
  BlockWrapper,
  Block,
  Total,
} from './styled'

const VoteCast = ({ votesFor, votesAgainst }) => (
  <Wrapper>
    <BlockWrapper>
      <Block>
        {parseFloat(votesFor).toLocaleString("us-en", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} For
      </Block>
      <Block secondary>
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