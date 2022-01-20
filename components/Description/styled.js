import styled from '@emotion/styled'

export const Wrapper = styled.div`
  h5 {
    font-size: 16px;
    color: #FFFFFF;
    font-family: VCR,sans-serif;
    font-style: normal;
    font-weight: normal;
    text-transform: uppercase;
    margin-top: 0;
  }

  p {
    font-size: 14px;
    font-weight: 500;
    line-height: 150%;
    color: #ACACAB;

    a {
      text-decoration: underline;
    }

    a:hover {
      opacity: 0.8;
    }

    span {
      font-weight: 500;
      color: var(--color-orange);
    }
  }

  p:nth-of-type(1) {
    margin-top: 0;
  }
`;
