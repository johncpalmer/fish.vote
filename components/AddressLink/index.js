import { Wrapper } from './styled'
import { VEX_NETWORK } from "@utils/constants";

const AddressLink = ({ address, text, shorten, length = 6 }) => (
  <Wrapper
    href={`${VEX_NETWORK.explorer_base_url}accounts/${address}`}
    rel="noopener noreferrer"
    target="_blank"
  >
    { text
      ? text
      : shorten
        ? `${address.substr(0, length)}...${address.slice(address.length - 4)}`
        : address}
  </Wrapper>
);

export default AddressLink;
