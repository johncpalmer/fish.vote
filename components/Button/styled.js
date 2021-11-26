import styled from 'styled-components';

export const Wrapper = styled.button`
  background-color: ${({ background }) => background ? background : '#f5a78814'};
  border-radius: 8px;
  color: ${({ color }) => color ? color : 'var(--color-orange)'};
  font-family: VCR, sans-serif;
  padding: 12px 16px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  border: none;
  cursor: pointer;

  + button {
    margin-left: 20px;
  }

  &:hover {
    opacity: 0.64;
  }
`;
