import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useRef
} from "react";
import InputValidator from "../utils/validator";

class InputTextValidator extends InputValidator {
  constructor(name, value, rules, checker) {
    super(name, value, rules, checker);

    this.checker = {
      ...this.checker,
      MAX_LENGTH: {
        validate: () => {
          return this.value.length <= 10;
        },
        getResponse: () => {
          return `${this.name} can have max 10 characters`;
        }
      },
      ALLOWED_CHARACTERS: {
        validate: () => {
          return /^[A-Za-z0-9]*$/.test(this.value);
        },
        getResponse: () => {
          return `${this.name} can contain only letters and numbers`;
        }
      },
      UNIQUE: {
        validate: () => {},

        getResponse: () => {
          return `${this.name} is already taken`;
        }
      }
    };
  }
}

const InputText = forwardRef(
  ({ name, rules, checker, defaultValue = "", type = "text" }, ref) => {
    const [data, setData] = useState({
      value: defaultValue,
      validating: false,
      error: ""
    });
    const validator = useRef(
      new InputTextValidator(name, defaultValue, rules, checker)
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
        <input
          ref={ref}
          id={name.toLowerCase()}
          name={name.toLowerCase()}
          type={type}
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

export default InputText;
