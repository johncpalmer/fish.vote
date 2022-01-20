import styled from '@emotion/styled';

export const Wrapper = styled.div`
  position: relative;

  label {
    color: rgb(172, 172, 171);
    display: block;
    font-family: VCR, sans-serif;
    font-size: 12px;
    letter-spacing: 1.5px;
    line-height: 16px;
    margin-top: 1.5em;
    padding-bottom: 8px;
    text-transform: uppercase;
  }

  span {
    color: white;
    opacity: 0.3;
    font-size: 12px;
    line-height: 16px;
    position: absolute;
    right: 20px;
    bottom: 8px;
    display: block;
  }

  textarea {
    font-family: "Inter", sans-serif;
    color: #ACACAB;
    background-color: rgba(255, 255, 255, 0.04);
    border-radius: 4px;
    border: none;
    font-size: 14px;
    line-height: 1.5;
    padding: 16px 20px;
    display: block;
    resize: none;
    width: 100%;
  }

  textarea:focus {
    outline: none;
    border-color: var(--color-orange);
    color: white
  }

  textarea::placeholder {
    color: #7f8082;
  }
`
