import styled from "styled-components"

export const Indicator = styled.div`
  background-color: #f5a78814;
  color: var(--color-orange);
  padding: 12px 16px;
  line-height: 20px;
  font-family: VCR, sans-serif;
  text-transform: uppercase;
  border-radius: 8px;

  span {
    vertical-align: middle;
    line-height: 19px;
  }

  img {
    margin-left: 6px;
    margin-top: 0.5px;
    vertical-align: middle;
  }

  &:hover {
    opacity: 0.9;
  }
`