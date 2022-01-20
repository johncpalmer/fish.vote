import styled from '@emotion/styled'

export const Wrapper = styled.div`
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

  textarea {
    resize: none;
  }

  input[type="text"],
  input[type="number"],
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
    width: 100%;
    margin-bottom: 1em;
  }

  input[type="text"]:focus,
  input[type="number"]:focus,
  textarea:focus {
    outline: none;
    border-color: var(--color-orange);
    color: white
  }

  input[type="text"]::placeholder,
  input[type="number"]::placeholder,
  textarea::placeholder {
    color: #7f8082;
  }
`
