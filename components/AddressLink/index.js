import { Wrapper } from './styled'

const AddressLink = ({ address, text }) => (
  <Wrapper
    href={`https://explore.vechain.org/accounts/${address}`}
    rel="noopener noreferrer"
    target="_blank"
  >
    { text ? text : address }
  </Wrapper>
);

export default AddressLink;

