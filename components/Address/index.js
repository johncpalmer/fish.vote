import { Wrapper } from './styled'

const AddressLink = ({ address, shorten }) => (
  <Wrapper>
    { shorten 
      ? `${address.substr(0, 6)}...${address.slice(address.length - 4)}`
      : address
    }
  </Wrapper>
);

export default AddressLink;

