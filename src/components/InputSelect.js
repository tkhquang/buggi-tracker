import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useRef
} from "react";

import InputValidator from "../utils/validator";

class InputSelectValidator extends InputValidator {}

const InputSelect = forwardRef(
  ({ name, options, defaultValue = "", rules, checker }, ref) => {
    const [data, setData] = useState({
      value: defaultValue,
      validating: false,
      error: ""
    });
    const validator = useRef(
      new InputSelectValidator(name, defaultValue, rules, checker)
    );

    const onChange = ({ target: { value } }) => {
      validator.current.newValue = value;

      setData({
        value,
        validating: true,
        error: validator.current.error
      });
    };

    useImperativeHandle(
      ref,
      () => ({
        getValue: () => {
          return data.value;
        },
        getState: () => {
          return data;
        },
        setValidating: () => {
          setData(prevState => ({
            ...prevState,
            validating: true,
            error: validator.current.error
          }));
        },
        setError: rule => {
          setData(prevState => ({
            ...prevState,
            validating: true,
            error: validator.current.getResponse(rule)
          }));
        },
        hasErrors: () => {
          return validator.current.error !== "";
        }
      }),
      [data]
    );

    return (
      <div className="select" data-test={name.toLowerCase()}>
        <label htmlFor={name.toLowerCase()}>{name}</label>
        <select
          ref={ref}
          id={name.toLowerCase()}
          name={name.toLowerCase()}
          onChange={onChange}
          value={data.value}
        >
          <option value="" disabled>
            select
          </option>
          {options.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {data.validating && data.error !== "" && (
          <div data-test="error" className="error">
            {data.error}
          </div>
        )}
      </div>
    );
  }
);

export default InputSelect;
