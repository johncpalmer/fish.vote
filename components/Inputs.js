import TextareaAutosize from "react-textarea-autosize"; // Auto-resizing textarea
import styles from "@styles/components/Inputs.module.scss"; // Component styles

// Single text input with label
function TextInputWithTopLabel({
  // Label title
  labelTitle,
  // Value handlers
  value,
  onChangeHandler,
  // Placeholder text
  placeholder,
}) {
  return (
    <div className={styles.input__text}>
      <label for={labelTitle}>{labelTitle}</label>
      <input
        id={labelTitle}
        type="text"
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
    <div className={styles.input__text}>
      <label for={labelTitle}>{labelTitle}</label>
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

// Export input fields
export { TextInputWithTopLabel, TextAreaInputWithTopLabel };
