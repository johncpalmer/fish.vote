import { Link } from './styled'

const AddressLink = ({ address }) => (
  <Link href={`https://explore.vechain.org/accounts/${address}`} target="_blank">
    { address }
  </Link>
);

export default AddressLink;

