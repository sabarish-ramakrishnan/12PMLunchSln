import React from 'react';

import './Spinner.css';
import BootstrapModal from '../BootstrapModal/BootstrapModal';


{/* <Spinner show={true} type="custom">test</Spinner>
<Spinner show={true} type="saving"/>
<Spinner show={true} /> or <Spinner show={true} type="loading"/> */}

const spinner = (props) => (
    <BootstrapModal showModal={props.show} modalClassName="spinnerModal">
        <div className="Loader"></div>
        {(!props.type || props.type === "loading") && <div className="">Loading. Please wait....</div>}
        {props.type && props.type === "waiting" && <div className="">Please wait....</div>}
        {props.type && props.type === "saving" && <div className="">Saving. Please wait....</div>}
        {props.type && props.type === "custom" && <div className="">{props.children}</div>}
    </BootstrapModal>
);

export default spinner;