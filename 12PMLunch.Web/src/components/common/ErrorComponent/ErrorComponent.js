import React from 'react';
import Aux1 from '../hoc/Aux1/Aux1';
import {Link} from 'react-router-dom'

const ErrorComponent = (props) => {
    return (
        props.show &&
        <div className="text-danger">

            {!props.children &&
                <Aux1>
                    <div className="h2">Oops! Something went wrong.</div>
                    <div className="h6">Please reach us at <a href="mailto:12pmlunch@gmail.com">12pmlunch@gmail.com</a> or
                    (872) 203-2812 so that we can help you.</div>
                </Aux1>
            }

            <Aux1>
                <strong>{props.children}</strong>
            </Aux1>
        </div>
    )
}

export default ErrorComponent;