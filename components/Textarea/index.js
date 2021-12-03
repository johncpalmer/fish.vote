import TextareaAutosize from "react-textarea-autosize"; // Auto-resizing textarea

import { Wrapper } from './styled'

const Textarea = ({
  label,
  value,
  onChangeHandler,
  placeholder,
  minRows,
}) => {
  return (
    <Wrapper>
      { label ? (
        <label htmlFor={label}>{label}</label>
      ) : null}

      <TextareaAutosize
        id={label}
        minRows={minRows}
        value={value}
        onChange={(e) => onChangeHandler(e.target.value)}
        placeholder={placeholder}
      />
      <span>markdown supported</span>
    </Wrapper>
  );
}

export default Textarea;
