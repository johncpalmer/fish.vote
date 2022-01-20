import { Wrapper } from './styled'

const Button = ({
  background,
  children,
  color,
  disabled,
  onClick,
  className,
}) => {
  return (
    <Wrapper
      className={className}
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
