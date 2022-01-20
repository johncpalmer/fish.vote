import styled from '@emotion/styled'

import colors from '../../design/colors';

export const Container = styled.div`
  width: 8px;
  height: 8px;
  background-color: white;
  border-radius: 4px;
  margin-right: 8px;
  overflow: hidden;
  background-color: ${props => (props.connected ? colors.green : colors.red)};
`;

