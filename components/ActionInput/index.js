import { Wrapper } from './styled'

const ActionInput = ({
  label,
  value,
  onChangeHandler,
  onChangeIndex,
  placeholder,
  type,
  decimalPlaces,
}) => {
  return (
    <Wrapper>
      { label ? (
        <label htmlFor={label}>{label}</label>
      ) : null}
      <input
        id={label}
        type={type}
        value={value}
        onChange={(e) => onChangeHandler(e.target.value, decimalPlaces, onChangeIndex)}
        placeholder={placeholder}
      />
    </Wrapper>
  );
};

export default ActionInput;

