import { Wrapper } from './styled'

const Input = ({
  label,
  value,
  onChange,
  placeholder,
  type,
}) => (
  <Wrapper>
    { label ? (
      <label htmlFor={label}>{label}</label>
    ) : null}
    <input
      id={label}
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </Wrapper>
)

export default Input