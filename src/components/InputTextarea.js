import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useRef
} from "react";
import InputValidator from "../utils/validator";

class InputTextareaValidator extends InputValidator {}

const InputTextarea = forwardRef(
  ({ name, rules, checker, defaultValue = "" }, ref) => {
    const [data, setData] = useState({
      value: defaultValue,
      validating: false,
      error: ""
    });
    const validator = useRef(
      new InputTextareaValidator(name, defaultValue, rules, checker)
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
      <div className="textbox" data-test={name.toLowerCase()}>
        <label htmlFor={name.toLowerCase()}>{name}</label>
        <textarea
          ref={ref}
          id={name.toLowerCase()}
          name={name.toLowerCase()}
          onChange={onChange}
          value={data.value}
        />
        {data.validating && data.error !== "" && (
          <div data-test="error" className="error">
            {data.error}
          </div>
        )}
      </div>
    );
  }
);

export default InputTextarea;
