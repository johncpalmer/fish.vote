
import styled from 'styled-components';

export const Wrapper = styled.a`
  border-top: 1px solid #1C1C22;
  background-color: #121218;
  padding: 16px 28px;
  display: flex;
  justify-content: space-between;
  -webkit-box-pack: justify;
  align-items: center;


  span {
    color: #ACACAB;
  }

  &:first-of-type {
    border-top: none;
  }

  &:last-of-type {
    border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;
    border-bottom: none;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.04);
  }
`;

export const Title = styled.div`
  flex: 2.5;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding-right: 20px;

  h4 {
    font-weight: 500;
    font-size: 16px;
    line-height: 150%;
    color: #ACACAB;
    margin: 0px;
  }

  span {
    font-weight: 500;
    font-size: 13px;
    line-height: 150%;
    color: #ACACAB;
    margin: 4px 0px 0px 0px;
  }
`

export const State = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  align-items: center;
`

export const Status = styled.div`
  justify-content: flex-end;
  display: flex;

  div {
    width: 8px;
    height: 8px;
    margin-right: 8px;
    border-radius: 50%;
    display: block;
  }
`;
