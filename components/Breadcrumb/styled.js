import styled from 'styled-components'

export const Wrapper = styled.div`
  margin-top: 40px;
`

export const Last = styled.a`
  font-size: 15px;
  line-height: 20px;
  font-weight: 600;
  color: #ACACAB;
  will-change: opacity;
  transition: 0.1s ease-in-out;
  display: block;

  &:hover {
    opacity: 0.8;
  }
`

export const State = styled.div`
  font-size: 14px;
  line-height: 1.5;
  color: var(--color-orange);
  padding: 6px 8px;
  border-radius: 8px;
  background-color: #f5a78814;
  margin-top: 12px;
  display: inline-block;
`

export const Title = styled.h1`
  color: white;
`

export const Details = styled.div`
  margin-bottom: 24px;

  span {
    font-size: 15px;
    line-height: 20px;
    font-weight: 500;
    color: #ACACAB;
    vertical-align: middle;
    display: inline-block;
  }

  a {
    color: var(--color-orange);
    font-family: VCR, san-serif;
    will-change: opacity;
    transition: 0.1s ease-in-out;
    word-break: break-all;

    &:hover {
      opacity: 0.8;
    }
  }

  div {
    background-color: #ACACAB;
    width: 4px;
    height: 4px;
    vertical-align: middle;
    display: inline-block;
    margin: 0px 11px;
    border-radius: 50%;
  }
`