import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const Wrapper = styled.div`
  margin: ${({ noMargin }) => noMargin ? 0 : '20px 0'};
`

export const BlockWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 24px;
  margin-top: 24px;

  @media screen and (max-width: 600px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
    row-gap: 24px;
  }
`;

export const Block = styled.div`
  border-radius: 8px;
  flex: 1;
  padding: 24px;
  font-size: 2rem;
  font-family: VCR, sans-serif;
  text-transform: uppercase;
  color: ${({ secondary }) => secondary ? '#ff385c' : '#37C9AC'};

  ${({ secondary }) => secondary ? css`
    background: linear-gradient(96.84deg, rgba(255, 56, 92, 0.16) 1.04%, rgb(255, 56, 92, 0.08) 98.99%);
  ` : css`
    background: linear-gradient(96.84deg, rgba(55, 201, 172, 0.16) 1.04%, rgb(55, 201, 172, 0.08) 98.99%);
  `}
`;

export const Total = styled.div`
  font-family: VCR, sans-serif;
  text-transform: uppercase;
  text-align: right;
  color: #ACACAB;
  @media screen and (max-width: 600px) {
    text-align: left;
  }
`
export const QuorumStatus = styled.div`
  font-family: VCR, sans-serif;
  text-transform: uppercase;
  text-align: left;
  color: #ACACAB;
`
