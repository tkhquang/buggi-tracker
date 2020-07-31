import React, {
  forwardRef,
  useState,
  useImperativeHandle,
  useRef
} from "react";

import InputValidator from "../utils/validator";

class InputDataListValidator extends InputValidator {}

const InputDataList = forwardRef(
  ({ plural, single, options, rules, defaultValue = [], checker }, ref) => {
    const singleLower = single.toLowerCase();
    const [list, setList] = useState(defaultValue);
    const [data, setData] = useState({
      value: "",
      validating: false,
      error: ""
    });
    const validator = useRef(
      new InputDataListValidator(single, "", rules, checker)
    );

    const addItem = () => {
      if (data.value.length === 0) {
        setData(prevState => ({
          ...prevState,
          validating: true,
          error: validator.current.error
        }));

        return;
      }

      setList(prevState => {
        const newState = [...prevState];
        newState.push(data.value);
        newState.sort();
        return newState;
      });
      setData(prevState => ({
        ...prevState,
        value: ""
      }));
    };

    const deleteItem = target => {
      setList(prevState => prevState.filter(item => item !== target));
    };

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
        getList: () => {
          return list;
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
      [list, data]
    );

    return (
      <div className={`${singleLower}-field`}>
        {plural}
        <ul>
          {list.map((item, index) => (
            <li key={item}>
              <button
                style={{
                  all: "unset",
                  cursor: "pointer",
                  color: "red",
                  marginRight: "5px"
                }}
                type="button"
                data-test={`del-${singleLower}-btn-${index + 1}`}
                data-test-dir="left"
                title="delete"
                onClick={() => deleteItem(item)}
              >
                x
              </button>
              <span data-test={`${singleLower}-${index + 1}`}>{item}</span>
            </li>
          ))}
        </ul>
        <div className="add-select-wrapper">
          <div
            className="select"
            data-test={`add-${singleLower}`}
            data-test-dir="left"
          >
            <select
              ref={ref}
              id={singleLower}
              name={singleLower}
              value={data.value}
              onChange={onChange}
              disabled={
                options.filter(option => !list.includes(option)).length === 0
              }
            >
              <option disabled value="">
                select
              </option>
              {options
                .filter(option => !list.includes(option))
                .map(option => (
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
          <button
            type="button"
            className="btn btn-primary"
            data-test={`add-${singleLower}-btn`}
            onClick={addItem}
            disabled={false}
          >
            Add
          </button>
        </div>
      </div>
    );
  }
);

export default InputDataList;
