import { Wrapper } from './styled'

const Button = ({ children, onClick }) => {
  return (
    <Wrapper onClick={onClick}>
      {children}
    </Wrapper>
  )
};

export default Button;