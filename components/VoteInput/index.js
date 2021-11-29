import { Wrapper, InputWrapper } from './styled'

const VoteInput = ({ onChange, voteFor }) => (
  <Wrapper>
    <InputWrapper>
      <input
        id="for"
        type="radio"
        value="For"
        checked={voteFor}
        onChange={() => onChange(true)}
      />
      <label htmlFor="for">For</label>
    </InputWrapper>
    <InputWrapper>
      <input
        id="against"
        type="radio"
        value="Against"
        checked={!voteFor}
        onChange={() => onChange(false)}
      />
      <label htmlFor="against">Against</label>
    </InputWrapper>
  </Wrapper>
)

export default VoteInput