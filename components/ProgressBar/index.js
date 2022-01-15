import { Wrapper } from './styled'

const ProgressBar = ({ color, votesFor, votesAgainst }) => (
  <Wrapper>
    <div
      style={{
        width:
              `${parseFloat(votesFor) / parseFloat(votesFor+votesAgainst) 
              * 100}%`,
        backgroundColor: color,
      }}
    />
  </Wrapper>
)

export default ProgressBar
