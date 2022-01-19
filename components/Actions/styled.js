import styled from 'styled-components'

export const Wrapper = styled.div`
  position: relative;

  &:after {
    content: 'scroll to see complete action';
    right: 24px;
    bottom: -24px;
    position: absolute;
    color: #ACACAB;
    font-size: 80%;
  }

  div {
    align-items: center;
    background-color: #121218;
    border-bottom: 1px solid #1C1C22;
    display: flex;
    padding: 24px;
    overflow-x: auto;

    > span {
      color: #ACACAB;
      margin-right: 12px;
    }

    > p {
      margin: 0;
    }
  }
`
