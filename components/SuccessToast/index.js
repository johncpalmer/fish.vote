import { Wrapper } from './styled'
import { VEX_NETWORK } from "@utils/constants";

const SuccessToast = ({ tx, action }) => (
  <Wrapper>
    Successfully { action }
    <div>
      <a
        href={`${VEX_NETWORK.explorer_base_url}transactions/${tx?.meta?.txID}`}
        rel="noopener noreferrer"
        target="_blank"
      >
        View on Explorer
      </a>
    </div>
  </Wrapper>
)

export default SuccessToast;
