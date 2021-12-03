import { Wrapper } from './styled'

const ProgressBar = ({ color, state, votes }) => (
  <Wrapper>
    <div
      style={{
        width:
          state === "Active"
            ? // Force 100% bar
              "100"
            : // If number of votes > 0 && < 100k
            parseFloat(votes) >= 0 &&
              parseFloat(votes) < 100000
            ? // Show 1%
              "1%"
            : // Else, show accurate value
              `${Math.min(
                (parseFloat(votes) / 10000000) * 100,
                // Maximum fill: 100%
                100
              )}%`,
        backgroundColor: color,
      }}
    />
  </Wrapper>
)

export default ProgressBar