import styled from 'styled-components'

export const Wrapper = styled.div`
  label {
    font-weight: 500;
    color: white;
    padding-bottom: 8px;
    display: block;
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
