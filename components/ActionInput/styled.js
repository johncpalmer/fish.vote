import styled from '@emotion/styled'

export const Wrapper = styled.div`
  width: calc(100% - 136px);
  margin-left: 136px;
  display: flex;
  -webkit-box-pack: justify;
  align-items: center;

  label {
    font-weight: 500;
    color: white;
    min-width: 80px;
    text-align: right;
  }

  textarea {
    resize: none;
  }

  input {
    margin-left: 20px;
    flex: 50%;
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
