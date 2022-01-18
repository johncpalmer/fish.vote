import { Wrapper } from './styled'

const SuccessToast = ({ tx, action }) => (
  <Wrapper>
    Successfully { action }
    <div>
      <a
        href={`https://explore.vechain.org/transactions/${tx?.meta?.txID}`}
        rel="noopener noreferrer"
        target="_blank"
      >
        View on Explorer
      </a>
    </div>
  </Wrapper>
)

export default SuccessToast;
