import { Wrapper, InputWrapper } from './styled'

const VoteCast = ({ color, votesFor, votesAgainst }) => (
  <Wrapper>
    <h4>Votes Cast</h4>

    <h1>
      <span style={{ color }}>
        For: {parseFloat(votesFor).toLocaleString("us-en", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>{"     "}
      <span style={{ color }}>
        Against: {parseFloat(votesAgainst).toLocaleString("us-en", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    </h1>
  </Wrapper>

    
)

export default VoteCast;