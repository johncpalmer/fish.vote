import styled from 'styled-components'

export const Wrapper = styled.header`
  position: sticky;
  top: 0;
  height: 72px;
  top: 0px;
  left: 0px;
  z-index: 999;
  width: 100%;
  background-color: var(--color-bg);
  display: flex;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.01);
  border-bottom: 1px solid #1C1C22;
  backdrop-filter: blur(40px);
  flex-shrink: 0;
  padding: 0 40px;

  @media screen and (max-width: 600px) {
    padding: 0 20px;
  }
`

export const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Auth = styled.div`
  display: flex;
  align-items: center;
  justify-items: center;
`

export const AuthConnected = styled.div`
  cursor: pointer;
  border-radius: 8px;
  border: none;

  span {
    font-weight: 500;
  }

  div {
    display: inline-block;
    color: white;
  }

  button {
    outline: none;
    background-color: #f5a78814;
    border: none;
    user-select: none;
    cursor: pointer;
    padding: 12px 16px;
    border-radius: 8px;
    will-change: transform;
    margin-left: 20px;

    span {
      margin: 0px 0.5rem 0px 0.25rem;
      vertical-align: middle;
      color: white;
      font-family: "VCR", sans-serif;
    }

    div {
      vertical-align: middle;
    }
  }

  button:focus,
  button:hover {
    opacity: 0.64px;
  }
`

export const AuthConnect = styled.button`
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

  &:hover {
    opacity: 0.64;
  }
`