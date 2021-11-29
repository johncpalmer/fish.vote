import { Wrapper } from './styled'

const Button = ({
  background,
  children,
  color,
  disabled,
  onClick,
}) => {
  return (
    <Wrapper
      background={background}
      color={color}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </Wrapper>
  )
};

export default Button;