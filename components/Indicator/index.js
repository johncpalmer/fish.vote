import PropTypes from 'prop-types'

import { Container } from './styled.js';

const Indicator = ({ connected }) => (
  <Container connected={connected} />
)

Indicator.propTypes = {
  connected: PropTypes.string.isRequired,
}

export default Indicator
