import { Wrapper } from './styled'

const AddressLink = ({ address, text, shorten }) => (
  <Wrapper
    href={`https://explore.vechain.org/accounts/${address}`}
    rel="noopener noreferrer"
    target="_blank"
  >
    { text 
      ? text
      : shorten
        ? `${address.substr(0, 6)}...${address.slice(address.length - 4)}` 
        : address}
  </Wrapper>
);

export default AddressLink;

