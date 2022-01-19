import styled, { css } from 'styled-components';

export const Wrapper = styled.div`
  display: block;
  background-color: #121218;
  background-image: linear-gradient(
    96.84deg,
    #f5a7880A 1.04%,
    #f5a78802 98.99%
  );
  margin-bottom: 24px;
  border-radius: 8px;

  ${({ shortMargin }) => shortMargin && css`
    margin-top: 24px;
  `}
`;

export const Header = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 0 24px;
  min-height: 72px;
  border-bottom: 1px solid #1C1C22;
`

export const Title = styled.div`
  font-size: 16px;
  color: #fff;
  font-family: VCR, sans-serif;
  font-style: normal;
  font-weight: 400;
  text-transform: uppercase;
`

export const Subtitle = styled.div`
  font-family: VCR, sans-serif;
  font-style: normal;
  font-weight: 400;
  text-transform: uppercase;
  color: #ACACAB;
`

export const Add = styled.div`
  height: 74px;
  padding: 0px 28px;
  background-color: #121218;
  display: flex;
  justify-content: space-between;
  -webkit-box-pack: justify;
  align-items: center;

  button {
    font-weight: 500;
    color: var(--color-orange);
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
  }

  button:hover {
    opacity: 0.8;
  }
`

export const Submit = styled.div`
  padding-top: 0;

  button {
    font-family: VCR, sans-serif;
    background-color: #f5a78814;
    border: none;
    color: var(--color-orange);
    line-height: 20px;
    font-size: 14px;
    border-radius: 8px;
    padding: 12px 16px;
    cursor: pointer;
    text-transform: uppercase;
    margin-top: 24px;
  }

  button:hover {
    opacity: 0.64;
  }

  button:disabled {
    background-color: #f5a788;
    opacity: 0.64;
    color: #121218;
    cursor: not-allowed;
  }
`

export const Actions = styled.div`
  div {
    padding: 12px 16px;

    > span {
      font-size: 15px;
      line-height: 150%;
    }

    p {
      font-size: 15px;
      line-height: 150%;
    }
  }
`

export const Content = styled.div`
  font-family: "Inter", sans-serif;
  color: white;
  padding: ${({ noPadding }) => noPadding ? 0 : '24px'};

  label:first-of-type {
    margin-top: 0;
  }

  p {
    color: white;
  }
`
