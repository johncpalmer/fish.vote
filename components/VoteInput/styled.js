import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  margin: 36px 0;
  align-items: center;
`

export const InputWrapper = styled.div`
  flex: 1;

  input[type="radio"] {
    opacity: 0;
    position: fixed;
    width: 0;
  }

  label {
    align-items: center;
    display: flex;
    font-family: VCR, Arial;
    font-size: 16px;
    justify-content: center;
    text-transform: uppercase;
    padding: 12px 16px;
    cursor: pointer;
    transition: all 0.2s linear;
  }

  #for {
    & + label {
      background-color: rgba(22, 206, 185, 0.05);
      border-radius: 8px 0 0 8px;
      color: rgb(22, 206, 185);

      &:hover {
        background-color: rgba(22, 206, 185, 0.16);
      }
    }

    &:checked + label {
      background-color: rgba(22, 206, 185, 0.16);
    }
  }

  #against {
    & + label {
      background-color: rgba(255, 56, 92, 0.05);
      border-radius: 0 8px 8px 0;
      color: rgb(252, 10, 84);

      &:hover {
        background-color: rgba(255, 56, 92, 0.16);
      }
    }

    &:checked + label {
      background-color: rgba(255, 56, 92, 0.16);
    }
  }


`;