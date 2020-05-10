import React, { Component } from 'react';
import common from '../../common/common';
import { Link } from 'react-router-dom';

class logout extends Component {
    constructor(props)
    {
        super(props);
    }
    componentDidMount() {
        common.removeLocalTokens();
        this.props.headerBanner(false);
    }
    render() {
        return (
            <div className="container ContactData" >
                <div className="row">
                    <div className="col-xs-12 col-md-12 col-sm-12">
                        <label className="h2">You have successfully logged out.</label>
                        <br />
                        <label className="h5"><Link to="/login" className="clickable">Click Here</Link> to login.</label>
                    </div>
                </div>
            </div>

        )
    }
}
export default logout;