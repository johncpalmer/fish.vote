import React, { useEffect, useState } from "react";
import { VEX_ACTIONS } from "@utils/constants";

import Spacer from "@components/Spacer";
import Selector from "@components/Selector";
import ActionInput from "@components/ActionInput";

import { Wrapper } from './styled'

const Action = ({ onChangeHandler, index }) => {
  // Local state containers
  const [func, setFunc] = useState(null);
  const [values, setValues] = useState([]);
  const [args, setArgs] = useState([]);
  const [argDecimals, setArgDecimals] = useState([]);
  const [contract, setContract] = useState(null);

  /**
   * Clears all children at current depth - 1
   * @param {Boolean} contractCleared if clearing contract, else clearing function layer
   */
  const clearChildren = (contractCleared) => {
    // If clearing at contract layer
    if (contractCleared) {
      // Nullify function
      setFunc(null);
    }

    // Else, nullify arguments and values
    setArgs([]);
    setArgDecimals([]);
    setValues([]);
  };

  /**
   * Prefill arrays on function selection
   */
  const updateArgsAndValues = () => {
    // Collect function
    const funcOptions =
      VEX_ACTIONS[contract.value.key].functions[func.value.key];

    // Prefill arrays based on function params
    setArgs(new Array(funcOptions.args.length).fill(""));
    setArgs(new Array(funcOptions.args.length).fill(""));
    setValues(new Array(funcOptions.values.length).fill(""));
  };

  /**
   * Update args array at index
   * @param {String} value to update
   * @param {Number} decimalPlaces number of decimal places for the value, undefined if not applicable (such as for strings/addresses)
   * @param {Number} index to update at
   */
  const updateArgsAtIndex = (value, decimalPlaces, index) => {
    let temp = args;
    temp[index] = value;
    setArgs([...temp]);

    let decimalTemp = argDecimals;
    decimalTemp[index] = decimalPlaces;
    setArgDecimals([...decimalTemp]);
  };

  /**
   * Update values array at index
   * @param {String} value to update
   * @param {Number} index to update at
   */
  const updateValuesAtIndex = (value, index) => {
    let temp = values;
    temp[index] = value;
    setValues([...temp]);
  };

  /**
   * Updates state of parent action array
   */
  const updateParentState = () => {
    onChangeHandler(
      [
        // Contract address if selected or null
        contract ? contract.value.address : null,
        // Function signature if selected or null
        func ? func.value.signature : null,
        // Args array
        args,
        // Arg decimals array
        argDecimals,
        // Values array
        values,
      ],
      index
    );
  };

  // Clear all children when contract value changes
  useEffect(() => clearChildren(true), [contract]);
  // On function update
  useEffect(() => {
    // Clear all arg/value children
    clearChildren(false);

    // If not null
    if (func) {
      // Also prefill args and values arrays
      updateArgsAndValues();
    }
  }, [func]);

  // Update state of parent container on any change
  useEffect(updateParentState, [contract, func, args, argDecimals, values]);

  return (
    <Wrapper>
      {/* Action label */}
      <label>Action #{index + 1}</label>

      {/* Contract selector */}
      <Spacer height="12" />
      <Selector
        value={contract}
        onChange={setContract}
        placeholder="Select contract..."
        // Filter all actions for contracts
        options={VEX_ACTIONS.map((action, i) => ({
          value: { address: action.address, key: i },
          label: action.contract,
        }))}
        depth={0}
      />

      {contract ? (
        // Function selector
        <>
          <Spacer height="20" />
          <Selector
            value={func}
            onChange={setFunc}
            placeholder={`Select ${contract.label} function...`}
            options={VEX_ACTIONS[contract.value.key].functions.map(
              (func, i) => ({
                value: { signature: func.signature, key: i },
                label: func.name,
              })
            )}
            depth={1}
          />
        </>
      ) : null}

      {VEX_ACTIONS[contract?.value.key]?.functions[func?.value.key] ? (
        // If both contract and function selected, show inputs for args
        <>
          {VEX_ACTIONS[contract.value.key].functions[
            func.value.key
            // Filter for all args under contract + function
          ].args.map((arg, i) => {
            return (
              <React.Fragment key={"arg_"+i}>
                <Spacer height="20" />
                <ActionInput
                  label={arg.name}
                  value={args[i] || ""}
                  decimalPlaces={arg.decimals}
                  type={arg.type}
                  placeholder={arg.placeholder}
                  onChangeHandler={updateArgsAtIndex}
                  onChangeIndex={i}
                />
              </React.Fragment>
            );
          })}

          {VEX_ACTIONS[contract.value.key].functions[func.value.key].values.map(
            // Filter for all values under contract + function
            (value, i) => {
              return (
              <React.Fragment key={"val_"+i}>
                  <Spacer height="20" />
                  <ActionInput
                    label={value.name}
                    value={values[i] || ""}
                    type={value.type}
                    placeholder={value.placeholder}
                    onChangeHandler={updateValuesAtIndex}
                    onChangeIndex={i}
                  />
              </React.Fragment>
              );
            }
          )}
        </>
      ) : null}
    </Wrapper>
  );
}

export default Action;
