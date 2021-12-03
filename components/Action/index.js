import React, { useEffect, useState } from "react";
import { uniqueId } from 'lodash'

import { VEX_ACTIONS } from "@utils/constants";

import Spacer from "@components/Spacer";
import Selector from "@components/Selector";
import ActionInput from "@components/ActionInput";

import { Wrapper } from './styled'

const Action = ({ onChangeHandler, index }) => {
  // Local state containers
  const [func, setFunc] = useState(null);
  const [values, setValues] = useState([]);
  const [targets, setTargets] = useState([]);
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

    // Else, nullify targets and values
    setTargets([]);
    setValues([]);
  };

  /**
   * Prefill arrays on function selection
   */
  const updateTargetsAndValues = () => {
    // Collect function
    const funcOptions =
      VEX_ACTIONS[contract.value.key].functions[func.value.key];

    // Prefill arrays based on function params
    setTargets(new Array(funcOptions.targets.length).fill(""));
    setValues(new Array(funcOptions.values.length).fill(""));
  };

  /**
   * Update targets array at index
   * @param {String} value to update
   * @param {Number} index to update at
   */
  const updateTargetsAtIndex = (value, index) => {
    let temp = targets;
    temp[index] = value;
    setTargets([...temp]);
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
        // Targets array
        targets,
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
    // Clear all target/value children
    clearChildren(false);

    // If not null
    if (func) {
      // Also prefill targets and values arrays
      updateTargetsAndValues();
    }
  }, [func]);

  // Update state of parent container on any change
  useEffect(updateParentState, [contract, func, targets, values]);

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

      {contract && func ? (
        // If both contract and function selected, show inputs for targets
        <>
          {VEX_ACTIONS[contract.value.key].functions[
            func.value.key
            // Filter for all targets under contract + function
          ].targets.map((target, i) => {
            return (
              <React.Fragment key={uniqueId('actions_')}>
                <Spacer height="20" />
                <ActionInput
                  key={uniqueId('select_')}
                  labelTitle={target.name}
                  value={targets[i]}
                  type={target.type}
                  placeholder={target.placeholder}
                  onChangeHandler={updateTargetsAtIndex}
                  onChangeIndex={i}
                />
              </React.Fragment>
            );
          })}

          {VEX_ACTIONS[contract.value.key].functions[func.value.key].values.map(
            // Filter for all values under contract + function
            (value, i) => {
              return (
              <React.Fragment key={uniqueId('actions_interior_')}>
                  <Spacer height="20" />
                  <ActionInput
                    key={i}
                    labelTitle={value.name}
                    value={values[i]}
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
