import styled from '@emotion/styled'
import { css } from '@emotion/react'

export const Wrapper = styled.div`
  height: 100%;
`

export const Content = styled.div`
  flex-grow: 1;

  ${({ short }) => short && css`
    padding-top: 34px;
  `}
`

export const Sizer = styled.div`
  max-width: 800px;
  margin: 0px auto;
  padding-bottom: 60px;
`
