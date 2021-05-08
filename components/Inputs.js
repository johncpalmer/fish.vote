import TextareaAutosize from "react-textarea-autosize"; // Auto-resizing textarea
import styles from "@styles/components/Inputs.module.scss"; // Component styles

// Single text input with label
function InputWithTopLabel({
  // Label title
  labelTitle,
  // Value handlers
  value,
  onChangeHandler,
  // Placeholder text
  placeholder,
  // Value type
  type,
}) {
  return (
    <div className={`${styles.input__general} ${styles.input__text}`}>
      <label htmlFor={labelTitle}>{labelTitle}</label>
      <input
        id={labelTitle}
        type={type}
        value={value}
        onChange={(e) => onChangeHandler(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

// Auto-resizing text input with label
function TextAreaInputWithTopLabel({
  // Label title
  labelTitle,
  // Value handlers
  value,
  onChangeHandler,
  // Placeholder text
  placeholder,
  // Minimum textarea rows to render
  minRows,
}) {
  return (
    <div className={`${styles.input__general} ${styles.input__text}`}>
      <label htmlFor={labelTitle}>{labelTitle}</label>
      <TextareaAutosize
        id={labelTitle}
        minRows={minRows}
        value={value}
        onChange={(e) => onChangeHandler(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

// Single action text input with side label
function ActionInputWithSideLabel({
  // Label title
  labelTitle,
  // Value handlers
  value,
  onChangeHandler,
  // Array index to update
  onChangeIndex,
  // Placeholder text
  placeholder,
  // Value type
  type,
}) {
  return (
    <div className={`${styles.input__general} ${styles.input__text_action}`}>
      <label htmlFor={labelTitle}>{labelTitle}</label>
      <input
        id={labelTitle}
        type={type}
        value={value}
        onChange={(e) => onChangeHandler(e.target.value, onChangeIndex)}
        placeholder={placeholder}
      />
    </div>
  );
}

// Export input fields
export {
  InputWithTopLabel,
  ActionInputWithSideLabel,
  TextAreaInputWithTopLabel,
};
