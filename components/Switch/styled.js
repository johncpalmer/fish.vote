import styled, { css } from 'styled-components'

export const Wrapper = styled.div`
  background-color: #121218;
  border-radius: 8px;
  display: inline-block;
  padding: 12px 4px;
  color: #ACACAB;
`

export const StyledLink = styled.a`
  border-radius: 4px;
  font-family: VCR, sans-serif;
  font-size: 16px;
  line-height: 19px;
  padding: 8px 12px;
  text-transform: uppercase;

  &:hover {
    opacity: 0.8;
  }

  ${({ active }) => active && css`
    background-color: #f5a78814;
    color: var(--color-orange);
  `};
`