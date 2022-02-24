import { QUORUM_TOTAL_VEX } from '@utils/constants';
import {
  Wrapper,
  BlockWrapper,
  Block,
  Total,
  QuorumStatus,
} from './styled'

const VoteCast = ({ votesFor, votesAgainst }) => (
  <Wrapper noMargin>
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

    <BlockWrapper>
      <Total>
        Total: {parseFloat(votesAgainst + votesFor).toLocaleString("us-en", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </Total>

      <QuorumStatus>
        Quorum reached? {((votesAgainst + votesFor) >= QUORUM_TOTAL_VEX) ? 'YES' : 'NO'}
      </QuorumStatus>
    </BlockWrapper>
  </Wrapper>
)

export default VoteCast;
