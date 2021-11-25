import styled, { css } from 'styled-components'

export const Content = styled.div`
  flex: 1;

  ${({ short }) => short && css`
    padding-top: 34px;
    height: 100%;
  `}
`

export const Sizer = styled.div`
  max-width: 800px;
  margin: 0px auto;
  padding-bottom: 60px;
`
