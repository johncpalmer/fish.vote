import { Wrapper } from './styled'

const Button = ({
  children,
  onClick,
  color,
  background,
}) => {
  return (
    <Wrapper
      background={background}
      color={color}
      onClick={onClick}
    >
      {children}
    </Wrapper>
  )
};

export default Button;