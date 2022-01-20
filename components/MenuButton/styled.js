import styled from '@emotion/styled'

export const Container = styled.div`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  z-index: 100;
`

export const Line = styled.div`
  height: ${props => `calc(${props.size}px * 0.1)`};
  width: ${props => props.size}px;
  background-color: ${props => props.color};

  transition: 0.2s all ease-in;
`

export const LineTop = styled(Line)`
  ${props => `
    margin-top: calc(${props.size}px * (0.8/3));
    transform: ${
      props.isOpen
        ? `
      translateY(calc(${props.size}px * (0.5 - 0.05 - (0.8/3)))) rotate(-45deg)
    `
        : `
      none
    `
    };
  `}
`
export const LineBottom = styled(Line)`
  ${props => `
    margin-top: calc(${props.size}px * (0.8/3));
    transform: ${
      props.isOpen
        ? `
      translateY(calc(${props.size}px * (0.5 - 0.05 - (0.8/3)) * -1)) rotate(45deg)
    `
        : `
      none
    `
    };
  `}
`
