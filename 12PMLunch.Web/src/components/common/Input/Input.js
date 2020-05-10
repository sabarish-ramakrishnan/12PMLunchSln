import React from 'react';
import './Input.css';
import Aux1 from '../hoc/Aux1/Aux1';
const Input = (props) => {

    let inputElement = null;
    const inputClasses = [props.inputClassName];

    if (props.shouldValidate && props.invalid && props.touched) {
        inputClasses.push('Invalid');
    }
    switch (props.elementtype) {

        case ('textarea'):
            inputElement = <textarea
                className={inputClasses.join(' ')}
                value={props.value}
                {...props.elementconfig}
                onChange={props.changed} />;
            break;
        case ('label'):
            inputElement = <label
                className={inputClasses.join(' ')}
                {...props.elementconfig}
            >{props.value}</label>;
            break;
        case ('select'):
            inputElement = <select
                className={inputClasses.join(' ')}
                value={props.value}
                onChange={props.changed} >
                {props.elementconfig.options.map(o => (
                    <option key={o.displayValue} value={o.value}>
                        {o.displayValue}
                    </option>
                ))}
            </select>;
            break;
        case ('radio'):
            inputElement = <Aux1>
                {props.elementconfig.options.map(o => (
                    <div className='radio' key={o.displayValue}>
                        <label>
                            <input  type='radio' value={o.value} name={props.children} onChange={props.changed} />{o.displayValue}
                        </label>
                    </div>
                ))}
            </Aux1>;
            break;
        default:
            inputElement = <input
                className={inputClasses.join(' ')}
                value={props.value}
                {...props.elementconfig}
                // type={props.type}
                // placeholder={props.placeholder}
                onChange={props.changed} />;
            break;
    }
    return (
        <Aux1>
            <label className="form-label">{props.children}</label>
            <div className="">
                {inputElement}
                {props.errorMessages && props.errorMessages.length > 0 &&
                    <span className="help-block">
                        {
                            props.errorMessages.map((msg, i) => <p className="error text-danger small" key={props.key + i}>{msg}</p>)
                        }
                    </span>
                }
            </div>
        </Aux1>
    );
}

export default Input;