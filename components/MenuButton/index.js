import React from 'react'

import { Container, LineTop, LineBottom } from './styled.js';

const MenuButton = ({
  size = 24,
  color = 'white',
  isOpen,
  onToggle,
}) => (
  <Container onClick={onToggle} size={size}>
    <LineTop size={size} isOpen={isOpen} color={color} />
    <LineBottom size={size} isOpen={isOpen} color={color} />
  </Container>
)

export default MenuButton
