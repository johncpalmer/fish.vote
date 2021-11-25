import Select from "react-select"; // React select

import { Indicator } from './styled'

// Custom select indicator
const IndicatorsContainer = () => {
  return (
    <Indicator>
      <span>Select</span>
      <img src="/vectors/chevron.svg" alt="Select chevron" />
    </Indicator>
  );
};

// Select dropdown
const Selector = ({
  value,
  onChange,
  options,
  placeholder,
  depth,
}) => {
  // Custom select styles for react-select
  const customSelectStyles = {
    // Depth adjustments at container level
    container: provided => ({
      ...provided,
      width: `calc(100% - ${depth * 68}px)`,
      marginLeft: depth * 68,
    }),
    // Control field border + padding
    control: (provided, state) => ({
      ...provided,
      border: state.isFocused
        ? `1px solid white`
        : state.isHovered
        ? "1px solid #e3e4e6"
        : "none",
      borderRadius: 4,
      backgroundColor: 'rgba(255, 255, 255, 0.04)',
      padding: "10px 12px 10px 20px",
      transition: "none",
      cursor: "pointer",
    }),
    // Individual value container font changes
    valueContainer: provided => ({
      ...provided,
      padding: 0,
      fontSize: 14,
      fontWeight: 400,
      fontFamily: "Inter, sans-serif",
      color: "#ACACAB",
    }),
    // Popup menu styles
    menu: provided => ({
      ...provided,
      backgroundColor: '#1F1D23',
      borderRadius: 4,
      border: "1px solid white",
      marginTop: 16,
    }),
    // Menu option styles
    option: provided => ({
      ...provided,
      padding: "12px 16px",
      color: '#ACACAB',
      cursor: "pointer",
      backgroundColor: "#1F1D23",
      "&:hover": {
        backgroundColor: "#ffffff0a"
      }
    }),
    singleValue: provided => ({
      ...provided,
      color: 'white'
    })
  };

  return (
    <div>
      <Select
        // Override Indicator container with custom component
        components={{ IndicatorsContainer }}
        // Inject custom styles
        styles={customSelectStyles}
        value={value}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
        // Custom theme overrides for color scheme
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary: "none",
            neutral30: "#e3e4e6",
            primary25: "#F7F8FA",
          },
        })}
      />
    </div>
  );
}

export default Selector;
