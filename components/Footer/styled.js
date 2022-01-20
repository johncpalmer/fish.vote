import styled from '@emotion/styled'

export const Wrapper = styled.footer`
  -webkit-box-pack: justify;
  align-items: center;
  border: 1px solid #1C1C22;
  display: flex;
  height: 52px;
  justify-content: space-between;
  flex-shrink: 0;

  div {
    width: auto;
    display: flex;
    height: 100%;
    align-items: center;

    ul {
      align-items: center;
      display: flex;
      height: 100%;
      justify-items: center;
      list-style-type: none;
      margin: 0px;
      padding: 0px;

      li {
        display: flex;
        align-items: center;
        height: 100%;

        a {
          text-transform: uppercase;
          color: #7f8082;
          font-family: VCR, sans-serif;
          font-size: 14px;
          height: 100%;
          padding: 0px 24px;
          display: flex;
          align-items: center;

          &:hover {
            color: white;
          }
        }
      }
    }
  }

  div:nth-of-type(1) {
    justify-content: flex-start;
  }

  div:nth-of-type(2) {
    justify-content: flex-end;
  }
`
